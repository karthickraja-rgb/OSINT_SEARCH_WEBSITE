from flask import Blueprint, app, request, jsonify
from scrapers.web_scraper import WebScraper
import urllib.parse

general_bp = Blueprint('general', __name__)


def search_general(query):
    """General web search across multiple sources"""
    try:
        scraper = WebScraper()
        encoded_query = urllib.parse.quote_plus(query)
        # Define free search sources
        sources = [
            f'https://duckduckgo.com/?q={encoded_query}',
            f'https://www.bing.com/search?q={encoded_query}',
        ]
        
        results = {
            'sources': [],
            'total_results': 0
        }
        
        for source in sources:
            try:
                source_results = scraper.scrape_general_search(source, query)
                results['sources'].append(source_results)
                results['total_results'] += len(source_results.get('results', []))
            except Exception as e:
                results['sources'].append({
                    'source': source,
                    'error': str(e)
                })
        
        return results
        
    except Exception as e:
        return {'error': str(e)}

@general_bp.route('/search', methods=['GET'])
def general_search():
    """General web search endpoint"""
    query = request.args.get('q', '')
    # Check if the query parameter is provided
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    results = search_general(query)
    return jsonify(results)
