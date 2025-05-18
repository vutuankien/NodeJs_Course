const router = require('express').Router();

const express = require('express');
const emailController = require('../controller/emalController');

router.post('/sendEmail', emailController.sendEmail);

module.exports = router;