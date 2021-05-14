import express, { Router } from 'express';

let router:Router = express.Router();

router.use('/save', require('./save_model'));
router.use('/model-list', require('./get_model_list'));

module.exports = router;