import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';

import { saveModel } from '../repositories/firebase_storage_repo';
import { removeDir } from '../helpers/fsHelpers';
import { saveModelPath } from '../repositories/firebase_rltdb_repo';

let router:Router = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { userId } = req.body
        const dir = `uploads/${userId}`;

        fs.access(dir, (err) => {
            if(err) {
                return fs.mkdir(dir, {recursive: true}, (err) => {cb(err, dir)});
            } else {
                return cb(null, dir);
            }
        });
    },
    filename: (req, file, cb) => {
        const { modelName } = req.body
        const filename = `${modelName}.stl`
        cb(null, filename);
    }
})

let upload = multer({storage: storage});

router.post('/', upload.single("file"), (req: Request, res: Response) => {
    console.log('Request recieved !');
    console.log(req.file);

    const { userId, modelName } = req.body
    saveModel(req.file.path)
        .then((modelId) => {

            saveModelPath(userId, modelName, modelId)
                .then(() => {
                    console.log('Upload successfull. id : ' + modelId)
                    res.send({
                        modelId : modelId
                    })
                })
                .catch((err) => {
                    console.log('Failed to save model name !')
                    res.send({
                        err : err
                    })
                });
        })
        .catch((err) => {
            console.log('Failed to upload !')
            res.send({
                err : err
            })
        })
        .finally(() => {
            removeDir(req.file.destination);
        })

});

module.exports = router;