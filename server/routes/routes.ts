import * as express from 'express';
import { Request, Response } from 'express';
const serverInfo = require('../controllers/serverInfo.controller');
const storeController = require('../controllers/store.controller');

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.send('Hello World!'));
router.get('/status', serverInfo.status);
router.post('/api/events', storeController.events);

module.exports = router;
