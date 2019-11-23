import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {


  url="https://us-central1-lacomanda-91df5.cloudfunctions.net/sendMail?dest=" ;
  urlRechazo="https://us-central1-lacomanda-91df5.cloudfunctions.net/mailRechazo?dest="
  //"https://us-central1-practicaprofesional-dbd4e.cloudfunctions.net/sendMail?dest="

  constructor(public http: HttpClient) {
    console.log('Hello HttpMailProvider Provider');
  }

  EnviarMail(mail: string, id:string)
  {
    let direccion= this.url + mail + "&id=" + id;
    return this.http.get(direccion).toPromise();
  }

  EnviarMailRechazo(mail: string)
  {
    let direccion= this.urlRechazo + mail;
    return this.http.get(direccion).toPromise();
  }
}
