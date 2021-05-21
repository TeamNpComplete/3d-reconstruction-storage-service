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
    const { userId } = req;
    const { modelName } = req.body

    saveModel(req.file.path)
        .then((model) => {
            model.modelName = modelName;
            saveModelPath(userId as string, modelName, model)
                .then(() => {
                    res.send({
                        modelName : model.modelName,
                        size : model.size,
                        dateCreated : model.dateCreated
                    })
                })
                .catch((err) => {
                    res.send({
                        err : err
                    })
                });
        })
        .catch((err) => {
            res.send({
                err : err
            })
        })
        .finally(() => {
            removeDir(req.file.destination);
        })

});

module.exports = router;