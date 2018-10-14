const express = require('express');
const serverInfo = require('../controllers/serverInfo.controller');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));
router.get('/status', serverInfo.status);

module.exports = router;
