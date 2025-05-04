class Auth {
    static isLoggedIn() {
        return !!(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    }

    static logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.replace('login.html');
    }

    static checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.replace('login.html');
        }
    }

    static checkAuthPages() {
        // Sửa đoạn này - đây có thể là nguyên nhân
        if (this.isLoggedIn()) {
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                window.location.replace('index.html');
            }
        }
    }
}

export default Auth; 
