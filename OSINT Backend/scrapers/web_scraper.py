from .base_scraper import BaseScraper
import re

class WebScraper(BaseScraper):
    def scrape_google_results(self, search_url):
        """Scrape Google search results"""
        try:
            response = self.get_page(search_url)
            if not response:
                return {'error': 'Failed to fetch Google results'}
            
            soup = self.parse_html(response.text)
            results = []
            
            # Parse Google search results
            for result in soup.find_all('div', class_='g'):
                try:
                    title_elem = result.find('h3')
                    link_elem = result.find('a')
                    snippet_elem = result.find('span', attrs={'data-ved': True})
                    
                    if title_elem and link_elem:
                        title = title_elem.get_text()
                        link = link_elem.get('href', '')
                        snippet = snippet_elem.get_text() if snippet_elem else ''
                        
                        results.append({
                            'title': title,
                            'url': link,
                            'snippet': snippet
                        })
                except Exception as e:
                    continue
            
            return {
                'results': results,
                'total': len(results)
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def scrape_general_search(self, source_url, query):
        """Scrape general search results"""
        try:
            response = self.get_page(source_url)
            if not response:
                return {'source': source_url, 'error': 'Failed to fetch'}
            
            soup = self.parse_html(response.text)
            results = []
            
            # Extract links and text mentioning the query
            for link in soup.find_all('a', href=True):
                text = link.get_text().strip()
                href = link.get('href', '')
                if (
                    query.lower() in text.lower()
                    and href.startswith('http')
                    and len(text) > 2  # Avoid empty or very short titles
                ):
                    results.append({
                        'title': text,
                        'url': href
                })
            
            return {
                'source': source_url,
                'results': results[:20],  # Limit results
                'total': len(results)
            }
            
        except Exception as e:
            return {'source': source_url, 'error': str(e)}
