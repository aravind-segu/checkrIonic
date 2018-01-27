import { Component } from '@angular/core';
import {NavController, ToastController, PopoverController, PopoverOptions, LoadingController} from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from "@ionic-native/camera-preview";
//import {HTTP} from '@ionic-native/http';
import { Http , RequestOptions, Headers} from '@angular/http';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  splash = true;
  tabBarElement: any
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public popOverCtrl: PopoverController,
              public diagnostic:Diagnostic,
              public cameraPreview: CameraPreview,
              public http: Http,
              public loadingCtrl: LoadingController,
              public androidFullScreen: AndroidFullScreen) {
    this.tabBarElement = document.querySelector('.tabbar');
    this.http = http
    this.androidFullScreen.isImmersiveModeSupported().then(() => this.androidFullScreen.immersiveMode())
      .catch((error:any) => console.log(error));
    this.initializePreview()
  }
  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false
      this.tabBarElement.style.display = 'flex';
    }, 4000)
  }
  checkPermissions(){
    this.diagnostic.isCameraAuthorized().then((authorized) =>{
      if(authorized)
        this.initializePreview();
      else {
        this.diagnostic.requestCameraAuthorization().then((status) =>{
          if(status == this.diagnostic.permissionStatus.GRANTED)
            this.initializePreview();
          else {
            this.toastCtrl.create({
              message: "Cannot access camera",
              position: "bottom",
              duration: 5000
            }).present()
          }
        });
      }
    })
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
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      // var link = "http://172.25.150.65:3000/"
      // var link = "http://192.168.11.119:3000/"
      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Loading Please Wait...'
      });
      loading.present()
      // var link = "http://192.168.1.69:3000/recognize"
      // var myData = {"img": encodeURIComponent(imageData.toString('base64'))}
      // //let options =new RequestOptions({body: myData});
      // this.http.post(link, myData).subscribe(data => {
      //   console.log("Entered")
      //   console.log(data)
      //   var jsonData = data.json()
      //   console.log(jsonData)
      //   console.log(jsonData.images)
      //   let listData = jsonData.images
      //   loading.dismiss()
      //   this.popOverCtrl.create(PopoverPage,
      //     {listData}).present()
      // },error => {
      //   console.log(error.error)
      // })

      // this.http.post("http://192.168.137.137:3000/recognition", {img:"abc"}, {"Content-Type": "application/json"} )
      //     .then(data => {
      //         console.log(data.status)
      //         console.log(data.data)
      //         console.log(data.headers)
      //     }).catch(error => {
      //         console.log(error.status);
      //         console.log(error.error);
      //         console.log(error.headers);
      //     }
      // )
      // console.log(imageData.toString('base64'))
      // console.log("-------------------------------------------------------------------------------------")
      // console.log(encodeURIComponent(imageData.toString('base64')))
      // let body = {
      //     img: encodeURIComponent(imageData.toString('base64'))
      // }
      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json')
      // console.log("Entered")
      // this.http.post("http://192.168.137.137:3000/recognition", {img: "abc"}, {
      //     headers: this.httpHeader.set('Content-Type', 'application/json')
      // })
      //     .subscribe(data => {
      //         console.log(data)
      //     }, error => {
      //         console.log(error)
      //     });

    }, (err) => {
      console.log(err)
    });
  }

  selectItem(item){
    console.log(item)
  }

}
