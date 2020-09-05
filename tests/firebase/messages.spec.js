/* eslint-env jest */

import * as firebase from '@firebase/testing';
import { projectId, getDb, getAdminDb } from './utils';

const myAuth = { uid: 'me' };
const otherAuth = { uid: 'other' };

const getFirestore = (auth) => getDb('messages', auth);

const getAdminFirestore = () => getAdminDb('messages');

beforeEach(async (done) => {
  await firebase.clearFirestoreData({ projectId });
  done();
});

afterAll(async (done) => {
  await firebase.clearFirestoreData({ projectId });
  await Promise.all(firebase.apps().map((app) => app.delete()));
  done();
});

describe('messages collection', () => {
  it("can't read messages if not logged in", async () => {
    const myMessageId = 'my-message';
    const myMessages = getAdminFirestore().doc(myMessageId);
    await myMessages.set({ userId: myAuth.uid });

    const db = getDb('messages');
    const testDoc = db.doc(myMessageId);
    await firebase.assertFails(testDoc.get());
  });

  it('can read any messages if logged in', async () => {
    const myMessageId = 'my-message';
    const myMessage = getAdminFirestore().doc(myMessageId);
    await myMessage.set({ userId: myAuth.uid });

    const otherMessageId = 'other-message';
    const otherMessage = getAdminFirestore().doc(otherMessageId);
    await otherMessage.set({ userId: otherAuth.uid });

    const myTestDoc = getFirestore(myAuth).doc(myMessageId);
    await firebase.assertSucceeds(myTestDoc.get());

    const otherTestDoc = getDb('messages', myAuth).doc(otherMessageId);
    await firebase.assertSucceeds(otherTestDoc.get());
  });

  it('can create my own message', async () => {
    const testDoc = getFirestore(myAuth).doc('my-message');
    const myMessage = { userId: myAuth.uid, content: 'message content' };
    await firebase.assertSucceeds(testDoc.set(myMessage));
  });

  it("can't create empty message", async () => {
    const testDoc = getFirestore(myAuth).doc('my-message');
    const myMessage = { userId: myAuth.uid, content: '' };
    await firebase.assertFails(testDoc.set(myMessage));
  });

  it("can't create other's message", async () => {
    const testDoc = getFirestore(myAuth).doc('my-message');
    const otherMessage = { userId: otherAuth.uid, content: 'message content' };
    await firebase.assertFails(testDoc.set(otherMessage));
  });

  it('can update my own message', async () => {
    const myMessageId = 'my-old-message';
    const myMessage = getAdminFirestore().doc(myMessageId);
    await myMessage.set({ userId: myAuth.uid });

    const testDoc = getFirestore(myAuth).doc(myMessageId);
    const myNewMessage = { userId: myAuth.uid, content: 'new message content' };
    await firebase.assertSucceeds(testDoc.update(myNewMessage));
  });

  it("can't update other's message", async () => {
    const otherMessageId = 'other-old-message';
    const otherMessage = getAdminFirestore().doc(otherMessageId);
    await otherMessage.set({ userId: otherAuth.uid });

    const testDoc = getFirestore(myAuth).doc(otherMessageId);
    const otherNewMessage = { userId: otherAuth.uid, content: 'new message content' };
    await firebase.assertFails(testDoc.update(otherNewMessage));
  });
});
