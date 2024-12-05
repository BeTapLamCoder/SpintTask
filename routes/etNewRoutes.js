const express = require('express');
const { createEtNews } = require('../controllers/etNewsController');
const {getETNews} = require('../controllers/etNewsController');
const router = express.Router();

router.post('/api/v1/et-news', createEtNews);
router.get('/api/v1/et-news', getETNews)
module.exports = router;
