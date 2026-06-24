const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
    static getHeaders() {
        const token = localStorage.getItem('access_token');
        return {
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    static isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    static async login(username, password) {
        const res = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            let errMsg = 'Login failed';
            if (errData.detail) errMsg = errData.detail;
            else if (Object.keys(errData).length > 0) errMsg = Object.values(errData)[0][0] || Object.values(errData)[0];
            throw new Error(errMsg);
        }
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        return data;
    }

    static async register(username, email, password, confirm_password) {
        const res = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirm_password })
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            let errMsg = 'Registration failed';
            if (errData.username) errMsg = `Username: ${errData.username[0]}`;
            else if (errData.email) errMsg = `Email: ${errData.email[0]}`;
            else if (errData.password) errMsg = `Password: ${errData.password[0]}`;
            else if (Object.keys(errData).length > 0) errMsg = Object.values(errData)[0][0] || Object.values(errData)[0];
            throw new Error(errMsg);
        }
        return await res.json();
    }

    static async logout() {
        try {
            await fetch(`${API_BASE_URL}/auth/logout/`, {
                method: 'POST',
                headers: this.getHeaders()
            });
        } catch(e) {} // Ignore errors, just clear local state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static async getProfile() {
        const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('Unauthorized');
        return await res.json();
    }

    static async search(type, query, imageFile) {
        const formData = new FormData();
        if (query) formData.append('query', query);
        if (imageFile) formData.append('image', imageFile);

        const res = await fetch(`${API_BASE_URL}/search/${type}/`, {
            method: 'POST',
            headers: {
                'Authorization': this.getHeaders().Authorization
            },
            body: formData
        });
        if (!res.ok) throw new Error('Search failed');
        return await res.json();
    }

    static async getTrending() {
        const res = await fetch(`${API_BASE_URL}/search/recommendations/`, {
            method: 'GET',
            headers: {
                'Authorization': this.getHeaders().Authorization,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error('Failed to load trending items');
        return await res.json();
    }

    static async getProductsByCategory(category, limit=12) {
        const res = await fetch(`${API_BASE_URL}/products/?category=${encodeURIComponent(category)}&limit=${limit}&random=true`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to load products');
        return await res.json();
    }

    // Addresses API
    static async getAddresses() {
        const res = await fetch(`${API_BASE_URL}/auth/addresses/`, { headers: this.getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch addresses');
        return await res.json();
    }

    static async addAddress(data) {
        const res = await fetch(`${API_BASE_URL}/auth/addresses/`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add address');
        return await res.json();
    }

    static async deleteAddress(id) {
        const res = await fetch(`${API_BASE_URL}/auth/addresses/${id}/`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete address');
    }

    // Favorites API
    static async getFavorites() {
        const res = await fetch(`${API_BASE_URL}/favorites/`, { headers: this.getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch favorites');
        return await res.json();
    }

    static async addFavorite(productId) {
        const res = await fetch(`${API_BASE_URL}/favorites/`, {
            method: 'POST',
            headers: { ...this.getHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });
        if (!res.ok) throw new Error('Failed to add favorite');
        return await res.json();
    }

    static async removeFavorite(id) {
        const res = await fetch(`${API_BASE_URL}/favorites/${id}/`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('Failed to remove favorite');
    }

    // Search History API
    static async getSearchHistory() {
        const res = await fetch(`${API_BASE_URL}/search-history/`, { headers: this.getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch search history');
        return await res.json();
    }

    static async deleteSearchHistory(id) {
        const res = await fetch(`${API_BASE_URL}/search-history/${id}/`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete search history');
    }

    static async clearSearchHistory() {
        const res = await fetch(`${API_BASE_URL}/search-history/clear_all/`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) throw new Error('Failed to clear search history');
    }

    static async deleteAccount(password) {
        const response = await fetch(`${API_BASE_URL}/users/delete/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
            let errorMsg = 'Failed to delete account';
            try {
                const data = await response.json();
                if (data.detail) errorMsg = data.detail;
            } catch (e) {}
            throw new Error(errorMsg);
        }
        // Success (204 No Content) returns nothing
    }
}
