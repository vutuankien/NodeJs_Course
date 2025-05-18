const express = require('express');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars').engine;
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


routes(app);


mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    })


app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);

function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
app.use(logger);



app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})