import admin from 'firebase-admin';
import { Model } from '../models/Model';

const databaseRef = admin.database().ref();


export function getModelId(userId: string, modelName : string) {
    return new Promise((resolve : (modelId: string) => void, reject : (err : Error) => void) => {
        databaseRef.child(`user_model/${userId}/${modelName}`).get()
            .then((value) => {
                if(value !== null) {
                    resolve(value.val());
                } else {
                    reject(new Error('Model with given name not found'));
                }
            })
            .catch((err) => {
                console.log(err);
            })
    })
}

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

export function deleteModel(userId: string, modelName: string) {
    return new Promise((resolve : (modelId: string) => void, reject : (err : Error) => void) => {
        databaseRef.child(`user_model/${userId}/${modelName}`).get()
            .then((data) => {
                let modelId = data.val();
                if(modelId !== null) {
                    databaseRef.child(`user_model/${userId}/${modelName}`).remove((err) => {
                        if(err) {
                            reject(err);
                        } else {    
                            resolve(modelId);
                        }
                    })
                } else {
                    reject(new Error('Model does not exist !'));
                }
            })
    });
}