const bookRepository = require('../../data/repositories/bookRepository');
const validator = require('../validators/bookValidator');

class BookService {
    async getAllBooks(status) {
        const books = await bookRepository.findAll(status);
        const stats = {
            available: books.filter(b => b.status === 'available').length,
            borrowed: books.filter(b => b.status === 'borrowed').length,
            total: books.length
        };
        return { books, statistics: stats };
    }

    async getBookById(id) {
        const bookId = validator.validateId(id);
        const book = await bookRepository.findById(bookId);
        if (!book) throw new Error('Book not found');
        return book;
    }

    async createBook(data) {
        validator.validateBookData(data);
        return await bookRepository.create(data);
    }

    async updateBook(id, data) {
        const bookId = validator.validateId(id);
        await this.getBookById(bookId);
        validator.validateBookData(data);
        return await bookRepository.update(bookId, data);
    }

    async borrowBook(id) {
        const book = await this.getBookById(id);
        if (book.status === 'borrowed') throw new Error('Book is already borrowed');
        return await bookRepository.updateStatus(id, 'borrowed');
    }

    async returnBook(id) {
        const book = await this.getBookById(id);
        if (book.status !== 'borrowed') throw new Error('Book is not borrowed');
        return await bookRepository.updateStatus(id, 'available');
    }

    async deleteBook(id) {
        const book = await this.getBookById(id);
        if (book.status === 'borrowed') throw new Error('Cannot delete borrowed book');
        return await bookRepository.delete(id);
    }
}
module.exports = new BookService();