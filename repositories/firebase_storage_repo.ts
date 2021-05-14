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