const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/books', bookRoutes);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));