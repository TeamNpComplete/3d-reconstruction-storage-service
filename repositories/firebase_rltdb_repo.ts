import admin from 'firebase-admin';

const databaseRef = admin.database().ref();

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