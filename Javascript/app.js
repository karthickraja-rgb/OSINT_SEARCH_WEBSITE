// Main application controller
class OSINTApp {
    constructor() {
        this.osintEngine = new OSINTEngine();
        this.currentResults = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.showSection('search');
        Utils.showNotification('OSINT Finder initialized. Remember to use responsibly.', 'success');
    }
    

    bindEvents() {
        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.startSearch();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        });

        // Enter key on search input
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startSearch();
            }
        });

        // Export buttons
        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            Utils.exportAsJSON(this.currentResults);
        });

        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            Utils.exportAsCSV(this.currentResults);
        });

        // New search button
        document.getElementById('newSearchBtn').addEventListener('click', () => {
            this.resetSearch();
        });

        // Search type change
        document.getElementById('searchType').addEventListener('change', (e) => {
            this.updateInputPlaceholder(e.target.value);
        });
    }

    // Update input placeholder based on search type
    updateInputPlaceholder(type) {
        const input = document.getElementById('searchInput');
        const placeholders = {
            'email': 'Enter email address (e.g., user@example.com)',
            'phone': 'Enter phone number (e.g., +1234567890)',
            'username': 'Enter username (e.g., aadhitya)',
            'name': 'Enter full name (e.g., santhosh kumar)'
        };
        input.placeholder = placeholders[type] || 'Enter search query';
    }

    // Start the search process
    async startSearch() {
        const query = document.getElementById('searchInput').value.trim();
        const type = document.getElementById('searchType').value;
        const selectedPlatforms = this.getSelectedPlatforms();

        // Validation
        if (!query) {
            Utils.showNotification('Please enter a search query', 'error');
            return;
        }

        if (selectedPlatforms.length === 0) {
            Utils.showNotification('Please select at least one platform', 'error');
            return;
        }

        try {
            // Show progress section
            this.showSection('progress');
            document.getElementById('searchQuery').textContent = query;

            // Perform search
            this.currentResults = await this.osintEngine.performSearch(query, type, selectedPlatforms);

            // Show results
            this.displayResults();
            this.showSection('results');

        } catch (error) {
            console.error('Search error:', error);
            Utils.showNotification(`Search failed: ${error.message}`, 'error');
            this.showSection('search');
        }
    }

    // Get selected platforms
    getSelectedPlatforms() {
        const checkboxes = document.querySelectorAll('.platform-item input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Display search results
    displayResults() {
        const resultsContainer = document.getElementById('resultsContainer');
        const stats = this.osintEngine.getSearchStats();

        // Update summary
        document.querySelector('.found-count').textContent = `${stats.found} Results Found`;
        document.querySelector('.platforms-searched').textContent = `${stats.total} Platforms Searched`;

        // Clear previous results
        resultsContainer.innerHTML = '';

        if (this.currentResults.length === 0) {
            resultsContainer.innerHTML = '<p>No results to display.</p>';
            return;
        }

        // Group results by status
        const foundResults = this.currentResults.filter(r => r.status === 'found');
        const notFoundResults = this.currentResults.filter(r => r.status === 'not-found');
        const errorResults = this.currentResults.filter(r => r.status === 'error');

        // Display found results first
        if (foundResults.length > 0) {
            resultsContainer.innerHTML += '<h4 style="color: #28a745; margin: 1rem 0;">✓ Results Found</h4>';
            foundResults.forEach(result => {
                resultsContainer.innerHTML += this.createResultCard(result);
            });
        }

        // Display not found results
        if (notFoundResults.length > 0) {
            resultsContainer.innerHTML += '<h4 style="color: #6c757d; margin: 1rem 0;">○ No Results</h4>';
            notFoundResults.forEach(result => {
                resultsContainer.innerHTML += this.createResultCard(result);
            });
        }

        // Display error results
        if (errorResults.length > 0) {
            resultsContainer.innerHTML += '<h4 style="color: #dc3545; margin: 1rem 0;">⚠ Errors</h4>';
            errorResults.forEach(result => {
                resultsContainer.innerHTML += this.createResultCard(result);
            });
        }
    }

    // Create result card HTML
    // ...existing code...
    // Create result card HTML
    createResultCard(result) {
        let statusClass;
        let statusText;
        if (result.status === 'found') {
            statusClass = 'found';
            statusText = 'Found';
        } else if (result.status === 'error') {
            statusClass = 'error';
            statusText = 'Error';
        } else {
            statusClass = 'not-found';
            statusText = 'Not Found';
        }
        return `
            <div class="result-card">
                <div class="result-header">
                    <div class="platform-badge ${result.platform.toLowerCase()}">
                        <i class="fab fa-${result.platform.toLowerCase()}"></i>
                        ${result.platform}
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="result-content">
                    ${result.content || `<p>${result.description}</p>`}
                </div>
                <div class="result-actions">
                    ${result.url && result.status !== 'error' ? 
                        `<a href="${result.url}" target="_blank" class="btn-small btn-visit">
                            <i class="fas fa-external-link-alt"></i> Visit
                        </a>` : ''}
                    <button class="btn-small btn-info" onclick="app.showResultDetails('${result.platform}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
    }

    // Show result details
    showResultDetails(platform) {
        const result = this.currentResults.find(r => r.platform === platform);
        if (result) {
            const details = `
Platform: ${result.platform}
Status: ${result.status}
Query: ${result.query}
Type: ${result.type}
Timestamp: ${new Date(result.timestamp).toLocaleString()}
URL: ${result.url || 'N/A'}
            `;
            alert(details); // Simple implementation - could be enhanced with modal
        }
    }

    // Show specific section
    showSection(section) {
        // Hide all sections
        document.getElementById('progress-section').classList.add('hidden');
        document.getElementById('results-section').classList.add('hidden');

        // Show requested section
        if (section === 'progress') {
            document.getElementById('progress-section').classList.remove('hidden');
        } else if (section === 'results') {
            document.getElementById('results-section').classList.remove('hidden');
        }
        // search section is always visible
    }

    // Reset search
    resetSearch() {
        document.getElementById('searchInput').value = '';
        this.currentResults = [];
        this.showSection('search');
        Utils.showNotification('Ready for new search', 'info');
    }
}

fetch('http://127.0.0.1:5500/index.html', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: 'your search term' })
})
.then(response => response.json())
.then(data => {
    // Update your UI with the data
    console.log(data);
})
.catch(error => console.error('Error:', error));


// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OSINTApp();
});

fetch('/api/google/dork?q=someusername&type=username')
  .then(res => res.json())
  .then(data => {
    data.results.forEach(result => {
      const link = document.createElement('a');
      link.href = result.url;
      link.textContent = result.title;
      link.target = '_blank';
      document.body.appendChild(link);
      document.body.appendChild(document.createElement('br'));
    });
  });
