from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import urllib.parse
import time

youtube_bp = Blueprint('youtube', __name__)

def search_youtube(query, max_results=10):
    """Search YouTube by scraping the search results page (no API key required)"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        encoded_query = urllib.parse.quote_plus(query)
        url = f"https://www.youtube.com/results?search_query={encoded_query}"
        response = requests.get(url, headers=headers, timeout=10)
        time.sleep(1)  # Be polite

        if response.status_code != 200:
            return {"error": f"Failed to fetch YouTube results (status {response.status_code})"}

        soup = BeautifulSoup(response.text, "html.parser")
        results = []
        for link in soup.find_all("a", href=True):
            href = link["href"]
            title = link.get("title")
            if href.startswith("/watch") and title:
                results.append({
                    "title": title,
                    "url": f"https://www.youtube.com{href}"
                })
            if len(results) >= max_results:
                break

        return {"results": results, "total": len(results)}
    except Exception as e:
        return {"error": str(e)}

@youtube_bp.route('/search', methods=['GET'])
def youtube_search():
    """YouTube search endpoint"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    results = search_youtube(query)
    return jsonify(results)