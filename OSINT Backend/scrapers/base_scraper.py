import requests
from bs4 import BeautifulSoup
import time
from config import Config

class BaseScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def get_page(self, url, **kwargs):
        """Get page content with error handling"""
        try:
            response = self.session.get(url, timeout=10, **kwargs)
            response.raise_for_status()
            time.sleep(Config.REQUEST_DELAY)
            return response
        except Exception as e:
            print(f"Error fetching {url}: {str(e)}")
            return None
    
    def parse_html(self, html_content):
        if not html_content:
            return None
        return BeautifulSoup(html_content, 'html.parser')
