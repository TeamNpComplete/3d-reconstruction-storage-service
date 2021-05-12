import express, { Router } from 'express';

let router:Router = express.Router();

router.use('/save', require('./save_model'));

module.exports = router;