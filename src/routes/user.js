const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');


// Define routes for user
router.post('/create', userController.create);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.patch('/update/:id', userController.update);
router.delete('/delete/:id', userController.delete);
router.get('/getAll', authMiddleware, userController.getAll);
router.get('/search', userController.search);
router.get('/:id', userController.getDetail);
router.get('/', userController.index);


module.exports = router;