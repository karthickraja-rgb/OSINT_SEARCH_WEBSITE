// OSINT Search Engine - Main search logic
class OSINTEngine {
    constructor() {
        this.results = [];
        this.searchProgress = 0;
        this.totalPlatforms = 0;
        this.completedSearches = 0;
    }

    // Main search method
    async performSearch(query, type, selectedPlatforms) {
        this.results = [];
        this.searchProgress = 0;
        this.completedSearches = 0;
        this.totalPlatforms = selectedPlatforms.length;

        // Validate input
        if (!this.validateInput(query, type)) {
            throw new Error('Invalid input format');
        }

        // Update progress
        this.updateProgress('Initializing search...', 0);

        // Search each platform
        for (let i = 0; i < selectedPlatforms.length; i++) {
            const platform = selectedPlatforms[i];
            await this.searchPlatform(platform, query, type);
            
            this.completedSearches++;
            const progress = (this.completedSearches / this.totalPlatforms) * 100;
            this.updateProgress(`Searched ${this.completedSearches}/${this.totalPlatforms} platforms`, progress);
            
            // Add delay between searches
            await this.delay(Utils.randomDelay(500, 1500));
        }

        this.updateProgress('Search completed!', 100);
        return this.results;
    }

    // Validate input based on type
    validateInput(query, type) {
        switch(type) {
            case 'email':
                return Utils.isValidEmail(query);
            case 'phone':
                return Utils.isValidPhone(query);
            case 'username':
                return Utils.isValidUsername(query);
            case 'name':
                return query.length >= 2;
            default:
                return false;
        }
    }

    // Search individual platform
    async searchPlatform(platformKey, query, type) {
        try {
            const platform = PlatformConfig[platformKey];
            if (!platform) {
                throw new Error(`Platform ${platformKey} not configured`);
            }

            const searchUrl = platform.searchUrl(query, type);
            
            // Simulate different search outcomes
            const result = await this.simulateSearch(platform, searchUrl, query, type);
            
            this.results.push(result);
            
        } catch (error) {
            console.error(`Error searching ${platformKey}:`, error);
            this.results.push({
                platform: platform ? platform.name : platformKey, // Use platform.name if available
                status: 'error',
                url: null,
                description: `Error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Simulate search results (replace with real API calls in production)
    async simulateSearch(platform, searchUrl, query, type) {
        // Add realistic delay
        await this.delay(Utils.randomDelay(1000, 3000));

        // Simulate different outcomes based on platform and query
        const outcomes = ['found', 'not-found', 'error'];
        const weights = [0.4, 0.5, 0.1]; // 40% found, 50% not found, 10% error
        
        const outcome = this.weightedRandomChoice(outcomes, weights);
        
        const result = {
            platform: platform.name,
            status: outcome,
            url: searchUrl,
            query: query,
            type: type,
            timestamp: new Date().toISOString()
        };

        switch(outcome) {
            case 'found':
                result.description = `Potential match found for "${query}" on ${platform.name}`;
                result.content = this.generateFoundContent(platform.name, query, type);
                break;
            case 'not-found':
                result.description = `No results found for "${query}" on ${platform.name}`;
                result.content = `<p>No public information found for this ${type} on ${platform.name}.</p>`;
                break;
            case 'error':
                result.description = `Error occurred while searching ${platform.name}`;
                result.content = `<p>Unable to complete search due to platform restrictions or network issues.</p>`;
                break;
        }

        return result;
    }

    // Generate content for found results
generateFoundContent(platform, query, type) {
    const templates = {
        'Google': `<div class="found-content"><h4>Search Results</h4><p>Multiple results found. Click "Visit" to see full search results on Google.</p></div>`,
        'Facebook': `<div class="found-content"><h4>Profile Found</h4><p>Potential Facebook profile found for this ${type}. Verify identity before proceeding.</p></div>`,
        'Twitter': `<div class="found-content"><h4>Account Located</h4><p>Twitter account found matching the search criteria. Check profile for verification.</p></div>`,
        'Instagram': `<div class="found-content"><h4>Instagram Profile</h4><p>Instagram account found. Review profile information and recent posts.</p></div>`,
        'LinkedIn': `<div class="found-content"><h4>Professional Profile</h4><p>LinkedIn profile found with professional information and connections.</p></div>`,
        'GitHub': `<div class="found-content"><h4>Developer Profile</h4><p>GitHub account found with code repositories and contribution history.</p></div>`,
        'Reddit': `<div class="found-content"><h4>Reddit User</h4><p>Reddit account found with post history and community participation.</p></div>`,
        'YouTube': `<div class="found-content"><h4>YouTube Channel</h4><p>YouTube channel or videos found related to the search query.</p></div>`
    };

    return templates[platform] || `<div class="found-content"><h4>Results Found</h4><p>Information found on ${platform} for "${query}".</p></div>`;
}

    // Weighted random choice
    weightedRandomChoice(choices, weights) {
        const random = Math.random();
        let weightSum = 0;
        
        for (let i = 0; i < choices.length; i++) {
            weightSum += weights[i];
            if (random <= weightSum) {
                return choices[i];
            }
        }
        
        return choices[choices.length - 1];
    }

    // Update search progress
    updateProgress(message, percentage) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = message;
        }
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get search statistics
    getSearchStats() {
        const found = this.results.filter(r => r.status === 'found').length;
        const notFound = this.results.filter(r => r.status === 'not-found').length;
        const errors = this.results.filter(r => r.status === 'error').length;
        
        return {
            total: this.results.length,
            found,
            notFound,
            errors
        };
    }
}
