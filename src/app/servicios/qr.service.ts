import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Injectable({
  providedIn: 'root'
})
export class QrService {
  public createdCode;
  constructor(public barcodeScanner: BarcodeScanner) { }

  public createCode(qrData: any) {
    return this.createdCode = qrData;
  }
}
