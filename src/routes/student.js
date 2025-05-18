const router = require('express').Router();

const express = require('express');

router.get('/', (req, res) => {
    res.send('Student Router');
})

router.get('/detail', (req, res) => {
    res.send('Student Detail Page');
})

module.exports = router;