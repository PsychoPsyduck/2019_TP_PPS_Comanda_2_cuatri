import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { StorageService } from './storage.service';
import { Events } from '@ionic/angular';

export interface data {

}

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  imagePickerOptions: ImagePickerOptions = {
    quality: 50,
    outputType: 1
  };

  constructor(
    private camera: Camera,
    private imagePicker: ImagePicker,
    private storageServ: StorageService,
    public events: Events) { }

  takePhoto() {
    return this.camera.getPicture(this.options)
      .then(res => {
        return res;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  choosePhoto() {
    return this.imagePicker.getPictures(this.imagePickerOptions)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  uploadPhoto(info) {
    return this.storageServ.uploadToStorage(info)
      .then(res => {
        res.ref.getDownloadURL()
          .then(url => {
            this.events.publish('urlFotoGuardada', url);
            return url;
          })
          .catch(err => {
            console.error(err.message);
            return err.message;
          })
      });
  }
}
