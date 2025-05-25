from flask import Blueprint, request, jsonify
from scrapers.web_scraper import WebScraper
import urllib.parse

google_bp = Blueprint('google', __name__)

def search_google(query):
    """Search Google using web scraping (Google Dorks)"""
    try:
        scraper = WebScraper()
        
        # Encode query for URL
        encoded_query = urllib.parse.quote_plus(query)
        search_url = f'https://www.google.com/search?q={encoded_query}&num=50'
        
        results = scraper.scrape_google_results(search_url)
        return results
        
    except Exception as e:
        return {'error': str(e)}

@google_bp.route('/search', methods=['GET'])
def google_search():
    """Google search endpoint"""
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    results = search_google(query)
    return jsonify(results)

@google_bp.route('/dork', methods=['GET'])
def google_dork():
    """Google Dork search with predefined patterns"""
    query = request.args.get('q', '')
    dork_type = request.args.get('type', 'general')

    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400

    # Use the raw query for dorks, not encoded
    dork_patterns = {
        'files': f'filetype:pdf OR filetype:doc OR filetype:xlsx "{query}"',
        'social': f'site:twitter.com OR site:facebook.com OR site:instagram.com "{query}"',
        'username': f'inurl:{query} site:twitter.com OR site:instagram.com OR site:github.com',
        'emails': f'"{query}" (email OR contact OR "@")',
        'general': query
    }

    dork_query = dork_patterns.get(dork_type, query)
    results = search_google(dork_query)
    return jsonify(results)
