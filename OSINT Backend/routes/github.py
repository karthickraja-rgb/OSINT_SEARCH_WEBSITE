from flask import Blueprint, request, jsonify
import requests
from config import Config
import time

github_bp = Blueprint('github', __name__)

def search_github(query, search_type='repositories'):
    """Search GitHub using public API"""
    try:
        headers = {}
        if Config.GITHUB_TOKEN:
            headers['Authorization'] = f'token {Config.GITHUB_TOKEN}'

        results = {}
        # Normalize search_type
        search_type = search_type.lower()
        if search_type == 'all':
            types = ['repositories', 'users', 'code']
        else:
            types = [search_type]

        # Search repositories
        if 'repositories' in types:
            repo_url = f'https://api.github.com/search/repositories?q={query}&per_page={Config.MAX_RESULTS}'
            repo_response = requests.get(repo_url, headers=headers)
            time.sleep(Config.REQUEST_DELAY)
            results['repositories'] = repo_response.json() if repo_response.status_code == 200 else {}

        # Search users
        if 'users' in types:
            user_url = f'https://api.github.com/search/users?q={query}&per_page={Config.MAX_RESULTS}'
            user_response = requests.get(user_url, headers=headers)
            time.sleep(Config.REQUEST_DELAY)
            results['users'] = user_response.json() if user_response.status_code == 200 else {}

        # Search code
        if 'code' in types:
            code_url = f'https://api.github.com/search/code?q={query}&per_page={Config.MAX_RESULTS}'
            code_response = requests.get(code_url, headers=headers)
            results['code'] = code_response.json() if code_response.status_code == 200 else {}

        return results

    except Exception as e:
        return {'error': str(e)}

@github_bp.route('/search', methods=['GET'])
def github_search():
    """GitHub search endpoint"""
    query = request.args.get('q', '')
    search_type = request.args.get('type', 'all')

    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400

    results = search_github(query, search_type)
    return jsonify(results)
