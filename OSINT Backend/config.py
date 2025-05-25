import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG= True
    GITHUB_TOKEN: str = os.getenv('GITHUB_TOKEN', '')
    REDDIT_CLIENT_ID: str = os.getenv('REDDIT_CLIENT_ID', '')
    REDDIT_CLIENT_SECRET: str = os.getenv('REDDIT_CLIENT_SECRET', '')
    REDDIT_USER_AGENT: str = os.getenv('REDDIT_USER_AGENT', 'osint_tool')
    SUPPORTED_PLATFORMS: list = [
        'github',
        'reddit', 
        'google',
        'general'
    ]
    REQUEST_DELAY: int = 1
    MAX_RESULTS: int = 50
