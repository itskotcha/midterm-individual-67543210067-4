class BookValidator {
    validateBookData(data) {
        if (!data.title || !data.author || !data.isbn) throw new Error('Title, author, and ISBN are required');
        const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
        if (!isbnPattern.test(data.isbn.replace(/-/g, ''))) throw new Error('Invalid ISBN format');
    }
    validateId(id) {
        const numId = parseInt(id);
        if (isNaN(numId)) throw new Error('Invalid book ID');
        return numId;
    }
}
module.exports = new BookValidator();