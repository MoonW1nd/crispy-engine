const express = require('express');
const serverInfo = require('../controllers/serverInfo.controller');
const storeController = require('../controllers/store.controller');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));
router.get('/status', serverInfo.status);
router.get('/api/events', storeController.events);

module.exports = router;
