from flask import Blueprint, request, jsonify
import requests
from config import Config
import time

reddit_bp = Blueprint('reddit', __name__)

def search_reddit(query, subreddit='all', sort='relevance'):
    """Search Reddit using public API without authentication"""
    try:
        headers = {
            'User-Agent': Config.REDDIT_USER_AGENT
        }
        
        # Search posts
        search_url = f'https://www.reddit.com/r/{subreddit}/search.json'
        params = {
            'q': query,
            'sort': sort,
            'limit': Config.MAX_RESULTS,
            't': 'all'
        }
        
        response = requests.get(search_url, headers=headers, params=params)
        time.sleep(Config.REQUEST_DELAY)
        
        if response.status_code == 200:
            data = response.json()
            posts = []
            
            for post in data.get('data', {}).get('children', []):
                post_data = post.get('data', {})
                posts.append({
                    'title': post_data.get('title', ''),
                    'url': post_data.get('url', ''),
                    'author': post_data.get('author', ''),
                    'subreddit': post_data.get('subreddit', ''),
                    'score': post_data.get('score', 0),
                    'created_utc': post_data.get('created_utc', 0),
                    'num_comments': post_data.get('num_comments', 0),
                    'selftext': post_data.get('selftext', '')[:500]  # Limit text
                })
            
            return {
                'posts': posts,
                'total': len(posts)
            }
        else:
            return {'error': f'Reddit API returned status {response.status_code}'}
            
    except Exception as e:
        return {'error': str(e)}

@reddit_bp.route('/search', methods=['GET'])
def reddit_search():
    """Reddit search endpoint"""
    query = request.args.get('q', '')
    subreddit = request.args.get('subreddit', 'all')
    sort = request.args.get('sort', 'relevance')
    
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    results = search_reddit(query, subreddit, sort)
    return jsonify(results)
