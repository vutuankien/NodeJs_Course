const userRouter = require('./user');
const studentRouter = require('./student');
const emailRouter = require('./email');
const routes = (app) => {

    app.use('/user', userRouter);
    app.use('/student', studentRouter);
    app.use('/email', emailRouter);
    app.get('/', (req, res) => {
        res.render('home');
    });
};

module.exports = routes;
