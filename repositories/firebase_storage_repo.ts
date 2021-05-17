import fs from 'fs';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { Model } from '../models/Model';

const storageBucket = admin.storage().bucket()

export function saveModel(file: string) {
    return new Promise((resolve : (model : Model) => void, reject: (err : Error) => void) => {
        let fileSize = fs.statSync(file).size;
        let dateCreated = new Date()
        let fileId = `${uuidv4()}`
        const storageWriteStream = storageBucket.file(`models/${fileId}.stl`).createWriteStream();
        
        fs.createReadStream(file).pipe(storageWriteStream)
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', () => {
                resolve({
                    modelId : fileId,
                    modelName : '',
                    size : fileSize,
                    dateCreated : dateCreated.toISOString()
                });
            });
    })
}

export function getModel(modelId : string) {
    return new Promise((resolve, reject) => {
        let modelData: any[] = [];

        storageBucket.file(`models/${modelId}.stl`).createReadStream()
            .on('data', (chunk) => {
                modelData.push(chunk)
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', () => {
                let buffer = Buffer.concat(modelData);
                resolve(buffer);
            })
    });
}

export function deleteModelFile(modelId : string) {
    return new Promise((resolve, reject) => {
        storageBucket.file(`models/${modelId}.stl`).delete()
            .then((res) => {
                resolve(null);
            })
            .catch((err) => {
                reject(err);
            })
    });
}