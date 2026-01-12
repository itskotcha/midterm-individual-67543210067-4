class LibraryAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async getAllBooks(status = null) {
        let url = `${this.baseURL}/books`;
        if (status && status !== 'all') url += `?status=${status}`;
        const response = await fetch(url);
        return await response.json();
    }
    
    async getBookById(id) {
        const response = await fetch(`${this.baseURL}/books/${id}`);
        return await response.json();
    }
    
    async createBook(bookData) {
        const response = await fetch(`${this.baseURL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return await response.json();
    }
    
    async updateBook(id, bookData) {
        const response = await fetch(`${this.baseURL}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return await response.json();
    }
    
    async borrowBook(id) {
        const response = await fetch(`${this.baseURL}/books/${id}/borrow`, { method: 'PATCH' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return await response.json();
    }
    
    async returnBook(id) {
        const response = await fetch(`${this.baseURL}/books/${id}/return`, { method: 'PATCH' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return await response.json();
    }
    
    async deleteBook(id) {
        const response = await fetch(`${this.baseURL}/books/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return await response.json();
    }
}

const api = new LibraryAPI('/api');