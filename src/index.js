const express = require('express');
const app = express();
const handlebars = require('express-handlebars').engine;
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
app.use(logger);

// View engine
app.engine('hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
routes(app);

// ✅ Nếu chạy local thì gọi listen (dựa vào biến môi trường)
if (process.env.LOCAL === 'true') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// ✅ Export app để dùng cho Vercel
module.exports = app;
