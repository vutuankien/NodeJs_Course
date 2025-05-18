const express = require('express');
const User = require('../Models/user.model');
const { createUserService, loginUserService, getAllUserService, getDetailUserService, searchUserService, updateUserService, deleteUserService, refreshTokenValid } = require('../services/UserService');


class userController {
    async create(req, res, next) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.json({
                    status: 'error',
                    message: 'Missing required fields',
                });
            }

            const response = await createUserService({ email, password, name });
            return res.json(response);

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields',
                });
            }

            const response = await loginUserService({ email, password }); // thêm await
            return res.json(response);

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    }
    async getDetail(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required',
            });
        } else {
            const response = await getDetailUserService(userId); // thêm await
            return res.json(response);
        }
    }
    async search(req, res) {
        const { email } = req.query;
        console.log("email : ", email);
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required',
            });
        } else {
            const response = await searchUserService(email); // thêm await
            return res.json(response);
        }
    }
    async update(req, res) {
        const userId = req.params.id;
        const { email, name } = req.query;

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required',
            });
        }

        if (!email && !name) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one field is required to update',
            });
        }

        const response = await updateUserService(userId, { email, name }); // thêm await
        return res.json(response);
    }

    async delete(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required',
            });
        }
        try {
            const response = await deleteUserService(userId); // thêm await
            return res.json(response);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    async getAll(req, res) {
        try {
            const response = await getAllUserService(); // thêm await
            return res.json(response);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    }
    async refreshToken(req, res) {
        const refresh_token = req.headers.token.split(' ')[1]; // sửa lại cách lấy refresh_token
        console.log("Refresh Token : ", refresh_token);
        if (!refresh_token) {
            return res.status(400).json({
                status: 'error',
                message: 'refresh token is not valid',
            });
        } else {
            const response = await refreshTokenValid(refresh_token); // thêm await
            return res.json(response);
        }
    }

    index(req, res) {
        res.send('Hello from userController!');
    }
}

module.exports = new userController();