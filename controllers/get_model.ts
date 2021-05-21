import express, { Router, Request, Response } from 'express';
import { deleteModel, getModelId } from '../repositories/firebase_rltdb_repo';
import { deleteModelFile, getModel } from '../repositories/firebase_storage_repo';

let router:Router = express.Router();

router.get('/', (req : Request, res : Response) => {
    let { userId } = req;
    let { modelName } = req.query;

    if(typeof(userId) === 'string' && typeof(modelName) === 'string') {
        getModelId(userId, modelName)
            .then((modelId) => {
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
            })
            .catch((err) => {
                res.send({
                    err : err
                })
            })
        
    } else {
        res.send({
            err : new Error('Invalid Query Paramaters !')
        })
    }
});

router.delete('/', (req : Request, res : Response) => {
    let { userId } = req;
    let { modelName } = req.query;

    if(typeof(userId) === 'string' && typeof(modelName) == 'string') {
        deleteModel(userId, modelName)
            .then((model) => {
                deleteModelFile(model.modelId)
                    .then(() => {
                        res.send({
                            result : 'success'
                        })
                    })
                    .catch((err) => {
                        res.send({
                            err : err
                        })
                    })
            })
            .catch((err) => {
                res.send({
                    err : err
                })
            })
    } else {
        res.send({
            err :  new Error('Invalid Query Paramaters !')
        })
    }
})

module.exports = router;