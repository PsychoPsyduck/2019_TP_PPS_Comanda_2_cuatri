import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Encuesta } from '../clases/Encuesta';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  private encuestasFirebase: AngularFirestoreCollection<any>;
  public encuestasObservable: Observable<any>;


  dbRef: AngularFirestoreCollection<any>;

  constructor(private objFirebase: AngularFirestore) {
    ;
  }

  GuardarEncuesta(encuesta: Encuesta)
  {
    
    let id = this.objFirebase.createId();
    encuesta.id = id;

    console.log(encuesta);
    return this.objFirebase.collection<any>("encuestas").doc(id).set(encuesta.toJson());

  }
}
