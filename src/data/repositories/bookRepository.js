const db = require('../database/connection');

class BookRepository {
    async findAll(status = null) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM books';
            let params = [];
            if (status) { sql += ' WHERE status = ?'; params.push(status); }
            db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
        });
    }

    async create(bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)', [title, author, isbn], function(err) {
                if (err) return reject(err);
                db.get('SELECT * FROM books WHERE id = ?', [this.lastID], (err, row) => err ? reject(err) : resolve(row));
            });
        });
    }

    async update(id, bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?', [title, author, isbn, id], (err) => {
                if (err) return reject(err);
                db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
            });
        });
    }

    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE books SET status = ? WHERE id = ?', [status, id], (err) => {
                if (err) return reject(err);
                db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM books WHERE id = ?', [id], (err) => err ? reject(err) : resolve({ message: 'Deleted' }));
        });
    }
}
module.exports = new BookRepository();