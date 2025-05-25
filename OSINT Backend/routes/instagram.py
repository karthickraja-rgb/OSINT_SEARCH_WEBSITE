from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import urllib.parse
import time

instagram_bp = Blueprint('instagram', __name__)

def search_instagram(username):
    """Search Instagram for a public profile by username (no API key required)"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        username = username.strip().lstrip('@#')  # Strip both @ and #
        url = f"https://www.instagram.com/{urllib.parse.quote_plus(username)}/"
        response = requests.get(url, headers=headers, timeout=10)
        time.sleep(1)  # Be polite

        if response.status_code == 404:
            return {"exists": False, "username": username, "error": "Profile not found"}
        if response.status_code != 200:
            return {"exists": False, "username": username, "error": f"Failed to fetch profile (status {response.status_code})"}

        soup = BeautifulSoup(response.text, "html.parser")
        # Try to extract the profile name and description from meta tags
        title = soup.find("meta", property="og:title")
        desc = soup.find("meta", property="og:description")
        profile_pic = soup.find("meta", property="og:image")

        return {
            "exists": True,
            "username": username,
            "profile_url": url,
            "full_name": title["content"] if title else "",
            "description": desc["content"] if desc else "",
            "profile_pic": profile_pic["content"] if profile_pic else ""
        }
    except Exception as e:
        return {"exists": False, "username": username, "error": str(e)}

@instagram_bp.route('/search', methods=['GET'])
def instagram_search():
    """Instagram search endpoint"""
    username = request.args.get('q', '')
    if not username:
        return jsonify({'error': 'Query parameter q is required'}), 400
    results = search_instagram(username)
    return jsonify(results)