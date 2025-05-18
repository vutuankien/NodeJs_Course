require('dotenv').config();
const express = require('express');
const app = express();
const handlebars = require('express-handlebars').engine;
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');

// Cấu hình kết nối MongoDB với timeout và retry
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_DB, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => {
            console.error('❌ Failed to connect to MongoDB:', err.message);
            console.log('⌛ Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Middleware cơ bản
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logger nâng cao
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
    }
    next();
});

// Cấu hình Handlebars với helpers và layout mặc định
app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        json: (context) => JSON.stringify(context),
        if_eq: (a, b, opts) => a === b ? opts.fn(this) : opts.inverse(this)
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
routes(app);

// Xử lý lỗi tập trung
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).render('error', {
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Xử lý tín hiệu dừng ứng dụng
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    mongoose.connection.close();
    process.exit(0);
});

// Chạy server khi ở local hoặc test
if (require.main === module || process.env.NODE_ENV === 'test') {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Xử lý lỗi khi khởi động server
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use`);
        } else {
            console.error('Server error:', err);
        }
        process.exit(1);
    });
}

module.exports = app;