let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadBooks();
});

function setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterBooks(e.target.dataset.filter));
    });
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('book-form').addEventListener('submit', handleSubmit);
}

async function loadBooks(status = null) {
    try {
        toggleLoading(true);
        const data = await api.getAllBooks(status);
        displayBooks(data.books);
        updateStatistics(data.statistics);
        toggleLoading(false);
    } catch (error) {
        alert('Error: ' + error.message);
        toggleLoading(false);
    }
}

function displayBooks(books) {
    const container = document.getElementById('book-list');
    if (books.length === 0) {
        container.innerHTML = '<div style="text-align:center; width:100%; padding:50px;">📚 No books found</div>';
        return;
    }
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <p>👤 ${escapeHtml(book.author)}</p>
            <p style="color:#9ca3af; font-size:12px;">🔖 ISBN: ${book.isbn}</p>
            <div style="margin:10px 0;">
                <span class="status-badge status-${book.status}">
                    ${book.status === 'available' ? '✅' : '📖'} ${book.status.toUpperCase()}
                </span>
            </div>
            <div class="actions">
                ${book.status === 'available' 
                    ? `<button class="btn btn-success" onclick="handleBorrow(${book.id})">Borrow</button>`
                    : `<button class="btn btn-warning" onclick="handleReturn(${book.id})">Return</button>`
                }
                <button class="btn btn-secondary" onclick="handleEdit(${book.id})">Edit</button>
                <button class="btn btn-danger" onclick="handleDelete(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateStatistics(stats) {
    document.getElementById('stat-available').textContent = stats.available;
    document.getElementById('stat-borrowed').textContent = stats.borrowed;
    document.getElementById('stat-total').textContent = stats.total;
}

function filterBooks(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === status);
    });
    loadBooks(status);
}

async function handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const data = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value
    };
    try {
        if (id) await api.updateBook(id, data);
        else await api.createBook(data);
        closeModal();
        loadBooks(currentFilter);
    } catch (error) { alert(error.message); }
}

async function handleBorrow(id) { if(confirm('Borrow this book?')) { await api.borrowBook(id); loadBooks(currentFilter); } }
async function handleReturn(id) { if(confirm('Return this book?')) { await api.returnBook(id); loadBooks(currentFilter); } }
async function handleDelete(id) { if(confirm('Are you sure?')) { await api.deleteBook(id); loadBooks(currentFilter); } }

async function handleEdit(id) {
    const book = await api.getBookById(id);
    document.getElementById('modal-title').textContent = 'Edit Book';
    document.getElementById('book-id').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('book-modal').style.display = 'flex';
}

function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Book';
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('book-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('book-modal').style.display = 'none'; }
function toggleLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    document.getElementById('book-list').style.display = show ? 'none' : 'grid';
}
function escapeHtml(t) { return t.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }