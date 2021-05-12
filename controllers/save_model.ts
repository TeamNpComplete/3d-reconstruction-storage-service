import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';

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
    res.end()
});

module.exports = router;