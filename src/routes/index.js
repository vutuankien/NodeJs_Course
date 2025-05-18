const userRouter = require('./user');
const studentRouter = require('./student');
const routes = (app) => {

    app.use('/user', userRouter);
    app.use('/student', studentRouter);
    app.get('/', (req, res) => {
        res.render('home');
    });
};

module.exports = routes;
