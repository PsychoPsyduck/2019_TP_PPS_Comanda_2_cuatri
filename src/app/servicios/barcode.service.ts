import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor(private barcodeScanner: BarcodeScanner) { }

  scan(format: string) {
    return this.barcodeScanner.scan({ "formats": format }).then(barcodeData => {
      return barcodeData;
    }).catch(err => {
      console.error('Error barcode', err);
      return err;
    });
  }

}
