import { Component } from '@angular/core';
import {NavController, ToastController, PopoverController, LoadingController} from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from "@ionic-native/camera-preview";
import {AndroidFullScreen} from '@ionic-native/android-full-screen'
import {AzureProvider} from '../../providers/azure/azure'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  splash = true;
  constructor(public toastCtrl: ToastController,
              public diagnostic:Diagnostic,
              public cameraPreview: CameraPreview,
              public androidFullScreen: AndroidFullScreen,
              public azureProvider: AzureProvider) {
    this.androidFullScreen.isImmersiveModeSupported().then(() => this.androidFullScreen.immersiveMode())
      .catch((error:any) => console.log(error));
    this.initializePreview()
  }
  initializePreview(){
    let previewRect: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.outerWidth,
      height: window.outerHeight,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    }
    var that = this;
    this.cameraPreview.startCamera(previewRect).then(function(){
    }, function(error){
      console.log('error', error);

    })

  }
  takePicture(){
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 500,
      height: 500,
      quality: 50
    }
    this.cameraPreview.takePicture().then((imageData) => {
      console.log(imageData);

    });
  }
}
