import express, { Router, Request, Response } from 'express';
import { Model } from '../models/Model';
import { getModelList } from '../repositories/firebase_rltdb_repo';

let router:Router = express.Router();

router.get('/', (req : Request, res : Response) => {
    let { userId } = req.query;

    if(typeof(userId) === 'string') {
        getModelList(userId)
            .then((modelList : Model[]) => {
                let list: { modelName: string; size: number | undefined; dateCreated: string | undefined; }[] = []
                modelList.forEach((model) => {
                    list.push({
                        modelName : model.modelName,
                        size : model.size,
                        dateCreated : model.dateCreated
                    })
                })
                res.send({
                    modelList : list
                })
            })
            .catch((err) => {
                console.log('Failed to get model list for given user !')
                res.send({
                    err : err
                })
            })
    } else {
        res.send({
            err : new Error('Invalid userId')
        });
    }
        
});

module.exports = router;