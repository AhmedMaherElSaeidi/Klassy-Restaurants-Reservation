import { Injectable } from '@angular/core';
import {
  getStorage,
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

@Injectable()
export default class FileService {
  private url?: any;

  constructor(public storage: Storage) {}

  uploadFile(file: File, file_name: string) {
    const storageRef = ref(this.storage, file_name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log('Upload is' + progress + '% done');
    });
  }

  getFile(file_name: string) {
    const storage = getStorage();
    getDownloadURL(ref(storage, file_name))
      .then((url) => {
        this.url = url;
      })
      .catch((error) => {
        console.log(error);
      });
      
    return this.url;
  }

  deleteFile(file_name: string) {
    const storage = getStorage();
    const desertRef = ref(storage, file_name);
    deleteObject(desertRef).catch((error) => {
      console.log(error);
    });
  }
}
