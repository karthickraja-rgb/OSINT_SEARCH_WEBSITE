// Platform configurations for OSINT searches
const PlatformConfig = {
    google: {
        name: 'Google',
        icon: 'fab fa-google',
        searchUrl: (query, type) => {
            const encodedQuery = encodeURIComponent(query);
            switch(type) {
                case 'email':
                    return `https://www.google.com/search?q="${encodedQuery}"`;
                case 'phone':
                    return `https://www.google.com/search?q="${encodedQuery}"`;
                case 'username':
                    return `https://www.google.com/search?q="${encodedQuery}"`;
                case 'name':
                    return `https://www.google.com/search?q="${encodedQuery}"`;
                default:
                    return `https://www.google.com/search?q=${encodedQuery}`;
            }
        },
        checkMethod: 'redirect' // Will redirect to search page
    },

    facebook: {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        searchUrl: (query, type) => {
            const encodedQuery = encodeURIComponent(query);
            return `https://www.facebook.com/search/people/?q=${encodedQuery}`;
        },
        checkMethod: 'redirect'
    },

    twitter: {
        name: 'Twitter',
        icon: 'fab fa-twitter', 
        searchUrl: (query, type) => {
            const encodedQuery = encodeURIComponent(query);
            if (type === 'username') {
                return `https://twitter.com/${encodedQuery}`;
            }
            return `https://twitter.com/search?q=${encodedQuery}`;
        },
        checkMethod: 'redirect'
    },

    instagram: {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        searchUrl: (query, type) => {
            if (type === 'username') {
                return `https://www.instagram.com/${query}/`;
            }
            const encodedQuery = encodeURIComponent(query);
            return `https://www.instagram.com/explore/tags/${encodedQuery}/`;
        },
        checkMethod: 'redirect'
    },

    linkedin: {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        searchUrl: (query, type) => {
            const encodedQuery = encodeURIComponent(query);
            return `https://www.linkedin.com/search/results/people/?keywords=${encodedQuery}`;
        },
        checkMethod: 'redirect'
    },

    github: {
        name: 'GitHub',
        icon: 'fab fa-github',
        searchUrl: (query, type) => {
            if (type === 'username') {
                return `https://github.com/${query}`;
            }
            const encodedQuery = encodeURIComponent(query);
            return `https://github.com/search?q=${encodedQuery}&type=users`;
        },
        checkMethod: 'redirect'
    },

    reddit: {
        name: 'Reddit',
        icon: 'fab fa-reddit',
        searchUrl: (query, type) => {
            if (type === 'username') {
                return `https://www.reddit.com/user/${query}`;
            }
            const encodedQuery = encodeURIComponent(query);
            return `https://www.reddit.com/search/?q=${encodedQuery}`;
        },
        checkMethod: 'redirect'
    },

    youtube: {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        searchUrl: (query, type) => {
            const encodedQuery = encodeURIComponent(query);
            return `https://www.youtube.com/results?search_query=${encodedQuery}`;
        },
        checkMethod: 'redirect'
    }
};
    