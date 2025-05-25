import re
import urllib.parse
import time

def validate_query(query):
    """Validate search query"""
    if not query or len(query.strip()) < 2:
        return False, "Query must be at least 2 characters"
    
    if len(query) > 500:
        return False, "Query too long"
    
    return True, ""

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\-\.\,\!\?]', '', text)
    
    return text

def extract_domain(url):
    """Extract domain from URL"""
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.netloc
    except (ValueError, AttributeError):
        return ""

def format_results(results, platform):
    """Format results for consistent output"""
    formatted = {
        'platform': platform,
        'timestamp': int(time.time()),
        'results': results,
        'count': len(results) if isinstance(results, list) else 0
    }
    
    return formatted
