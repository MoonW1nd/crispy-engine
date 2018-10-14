const express = require('express');
const serverInfo = require('../controllers/serverInfo.controller');
const storeController = require('../controllers/store.controller');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));
router.post('/status', serverInfo.status);
router.post('/api/events', storeController.events);

module.exports = router;
