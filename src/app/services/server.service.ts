import { onSnapshot, query, where } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  Firestore,
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable()
export class ServerService {
  listOfDocs: any[] = [];
  constructor(private db: Firestore) {}

  addNewRecord(object: any, collection_name: string) {
    const dbInstance = collection(this.db, collection_name);
    return addDoc(dbInstance, { ...object });
  }

  addNewRecordWithID(id: string, object: any, collection_name: string) {
    const dbInstance = collection(this.db, collection_name);
    return setDoc(doc(dbInstance, id), { ...object });
  }

  updateRecord(id: string, object: any, collection_name: string) {
    const dataUpdate = doc(this.db, collection_name, id);
    return updateDoc(dataUpdate, { ...object });
  }

  getRecord(id: string, collection_name: string) {
    const dbInstance = collection(this.db, collection_name);
    return getDoc(doc(dbInstance, id));
  }

  getAll(collection_name: string) {
    return collection(this.db, collection_name);
  }

  deleteRecord(id: string, collection_name: string) {
    const dataDelete = doc(this.db, collection_name, id);
    return deleteDoc(dataDelete);
  }

  SearchForRecordInArray(id: string) {
    return this.listOfDocs.find((doc) => {
      return doc.id == id;
    });
  }
}
