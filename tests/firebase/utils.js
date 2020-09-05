import * as firebase from '@firebase/testing';

export const projectId = 'project-id';

export const getDb = (collection, auth = null) => (
  firebase
    .initializeTestApp({ projectId, auth })
    .firestore()
    .collection(collection)
);

export const getAdminDb = (collection) => (
  firebase
    .initializeAdminApp({ projectId })
    .firestore()
    .collection(collection)
);
