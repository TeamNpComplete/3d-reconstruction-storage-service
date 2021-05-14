import express, { Router, Request, Response } from 'express';
import { getModel } from '../repositories/firebase_storage_repo';

let router:Router = express.Router();

router.get('/', (req : Request, res : Response) => {
    let { modelId } = req.query;

    if(typeof(modelId) === 'string') {
        getModel(modelId)
            .then((data) => {
                res.setHeader('Content-Type', 'model/stl')
                res.send(data);
            })
            .catch((err) => {
                res.send({
                    err : err
                })
            })
    }
});

module.exports = router;