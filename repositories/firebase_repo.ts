import fs from 'fs';
import admin from 'firebase-admin';

const databaseRef = admin.database().ref();
const storageBucket = admin.storage().bucket()

export async function saveModel(userId : string, modelName: string, file: string) {
    console.log(file);
    const storageWriteStream = storageBucket.file(`${userId}/${modelName}.stl`).createWriteStream();

    fs.createReadStream(file).pipe(storageWriteStream)
        .on('error', (err) => {
            throw err;
        })
        .on('finish', () => {
            return true;
        });
}