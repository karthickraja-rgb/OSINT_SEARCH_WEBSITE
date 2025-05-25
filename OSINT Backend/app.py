from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.github import github_bp, search_github
from routes.reddit import reddit_bp, search_reddit
from routes.google import google_bp, search_google
from routes.general import general_bp, search_general
from routes.facebook import facebook_bp, search_facebook
from routes.instagram import instagram_bp, search_instagram
from routes.youtube import youtube_bp, search_youtube
from config import Config
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Register blueprints
app.register_blueprint(github_bp, url_prefix='/api/github')
app.register_blueprint(reddit_bp, url_prefix='/api/reddit')
app.register_blueprint(google_bp, url_prefix='/api/google')
app.register_blueprint(general_bp, url_prefix='/api/general')
app.register_blueprint(facebook_bp, url_prefix='/api/facebook')
app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
app.register_blueprint(youtube_bp, url_prefix='/api/youtube')

@app.route('/')
def index():
    return "OSINT API is running. Use POST /api/search."

@app.route('/api/search', methods=['POST'])
def multi_platform_search():
    """Main endpoint for multi-platform OSINT search"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        platforms = data.get('platforms', [])

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        supported_platforms = [
            'github', 'reddit', 'google', 'general',
            'facebook', 'instagram', 'youtube'
        ]
        platforms = [p for p in platforms if p in supported_platforms]

        results = {}

        # Search each platform
        for platform in platforms:
            try:
                if platform == 'github':
                    results[platform] = search_github(query)
                elif platform == 'reddit':
                    results[platform] = search_reddit(query)
                elif platform == 'google':
                    results[platform] = search_google(query)
                elif platform == 'general':
                    results[platform] = search_general(query)
                elif platform == 'facebook':
                    results[platform] = search_facebook(query)
                elif platform == 'instagram':
                    results[platform] = search_instagram(query)
                elif platform == 'youtube':
                    results[platform] = search_youtube(query)
            except Exception as e:
                logger.error(f"Error searching {platform}: {str(e)}")
                results[platform] = {'error': str(e)}

        return jsonify({
            'query': query,
            'platforms': platforms,
            'results': results
        })

    except Exception as e:
        logger.error(f"Multi-platform search error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/platforms', methods=['GET'])
def get_supported_platforms():
    """Get list of supported platforms (free only)"""
    return jsonify({
        'supported_platforms': [
            {
                'name': 'github',
                'display_name': 'GitHub',
                'description': 'Search GitHub repositories, users, and code',
                'free': True
            },
            {
                'name': 'reddit',
                'display_name': 'Reddit',
                'description': 'Search Reddit posts and comments',
                'free': True
            },
            {
                'name': 'google',
                'display_name': 'Google',
                'description': 'General web search using Google dorks',
                'free': True
            },
            {
                'name': 'general',
                'display_name': 'General Web',
                'description': 'Search across various websites',
                'free': True
            },
            {
                'name': 'facebook',
                'display_name': 'Facebook',
                'description': 'Search Facebook profiles or posts',
                'free': True
            },
            {
                'name': 'instagram',
                'display_name': 'Instagram',
                'description': 'Search Instagram profiles or posts',
                'free': True
            },
            {
                'name': 'youtube',
                'display_name': 'YouTube',
                'description': 'Search YouTube videos or channels',
                'free': True
            }
        ],
        'removed_platforms': [
            # List any platforms you want to show as removed/restricted
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)