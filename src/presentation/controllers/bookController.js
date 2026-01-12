const bookService = require('../../business/services/bookService');

class BookController {
    async getAllBooks(req, res, next) {
        try { res.json(await bookService.getAllBooks(req.query.status)); } 
        catch (e) { next(e); }
    }
    async getBookById(req, res, next) {
        try { res.json(await bookService.getBookById(req.params.id)); } 
        catch (e) { next(e); }
    }
    async createBook(req, res, next) {
        try { res.status(201).json(await bookService.createBook(req.body)); } 
        catch (e) { next(e); }
    }
    async updateBook(req, res, next) {
        try { res.json(await bookService.updateBook(req.params.id, req.body)); } 
        catch (e) { next(e); }
    }
    async borrowBook(req, res, next) {
        try { res.json(await bookService.borrowBook(req.params.id)); } 
        catch (e) { next(e); }
    }
    async returnBook(req, res, next) {
        try { res.json(await bookService.returnBook(req.params.id)); } 
        catch (e) { next(e); }
    }
    async deleteBook(req, res, next) {
        try { res.json(await bookService.deleteBook(req.params.id)); } 
        catch (e) { next(e); }
    }
}
module.exports = new BookController();