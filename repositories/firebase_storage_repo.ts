import fs from 'fs';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

const storageBucket = admin.storage().bucket()

export function saveModel(file: string) {
    return new Promise((resolve : (filePath : string) => void, reject: (err : Error) => void) => {
        let fileId = `${uuidv4()}`
        const storageWriteStream = storageBucket.file(`models/${fileId}.stl`).createWriteStream();
    
        fs.createReadStream(file).pipe(storageWriteStream)
            .on('error', (err) => {
                reject(err);
            })
            .on('finish', () => {
                resolve(fileId);
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
                resolve(buffer.toString());
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