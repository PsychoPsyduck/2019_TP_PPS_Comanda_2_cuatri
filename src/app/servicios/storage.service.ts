import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  newName: string;
  dbRef: AngularFirestoreCollection<any>;

  constructor(
    private fStorage: AngularFireStorage,
    private db: AngularFirestore) {
    this.dbRef = this.db.collection("files");
  }

  uploadToStorage(info): AngularFireUploadTask {
    this.newName = `${new Date().getTime()}.jpeg`;
    let image = `data:image/jpeg;base64,${info}`;
    return this.fStorage.ref(`files/${this.newName}`).putString(image, 'data_url');
  }

  storeInfoDatabase(data) {
    return this.dbRef.doc(this.newName).set(data);
  }

}
