import admin from 'firebase-admin';
import { Model } from '../models/Model';

const databaseRef = admin.database().ref();

export function getModelList(userId: string) {
    return new Promise((resolve : (modelList : Model[]) => void, reject : (err : Error) => void) => {
        databaseRef.child(`user_model/${userId}`).get()
            .then((data) => {
                let modelList : Model[] = [];
                data.forEach((model) => {
                    if(model.key !== null)
                        modelList.push({
                            modelName: model.key,
                            modelId : model.val()
                        })
                })
                resolve(modelList);
            })
            .catch((err) => {
                reject(err);
            }) 
    })
}

export function saveModelPath(userId: string, modelName: string, modelId: string) {
    return new Promise((resolve, reject) => {
        databaseRef.child(`user_model/${userId}/${modelName}`).set(modelId)
            .then(() => {
                resolve(null);
            })
            .catch((err) => {
                reject(err);
            });
    });
}