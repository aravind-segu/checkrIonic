import { Component } from '@angular/core';
import {NavController, ToastController, PopoverController, LoadingController} from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from "@ionic-native/camera-preview";
import {AndroidFullScreen} from '@ionic-native/android-full-screen'
import {AzureProvider} from '../../providers/azure/azure'
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import {PopoverPage} from '../popover/popover';

import 'rxjs/add/operator/map'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  splash = true;
  loading = this.loadingCtrl.create({
    spinner: 'dots',
    content: 'Loading Please Wait...'
  });
  constructor(public toastCtrl: ToastController,
              public diagnostic:Diagnostic,
              public loadingCtrl: LoadingController,
              public cameraPreview: CameraPreview,
              public popOverCtrl: PopoverController,
              public androidFullScreen: AndroidFullScreen,
              public http: Http) {
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
      //console.log(imageData.toDataURL())
      this.loading.present()
      this.sendImage(imageData)

    });

  }
  mapClicked(){
    console.log("Clicked on Map")
  }
  apiUrl = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true';
  apiKey = 'ae6a8b7ae7a64d84ba7aab7678ad2174';
  returnUrl = '';
  words = [];
  width = []
  height= [];
  left = [];
  bottom = [];
  resultList = [];
  sendImage(image){
    var headers = new Headers();
    var returnUrl;
    headers.append("Ocp-Apim-Subscription-Key", this.apiKey)
    headers.append("Content-Type", "application/octet-stream")
    headers.append('responseType', 'text');

    this.http.post(this.apiUrl, this.makeblob("data:image/png;base64," + image.toString('base64')), {headers: headers})
      .subscribe(data => {
          console.log("Entered Subscribe")
          //console.log(data.headers.get("Operation-Location"));
          console.log(data.headers.get("Operation-Location"))
          returnUrl = (data.headers.get("Operation-Location")).toString()
          this.sleep(4000).then(() => {
            var returnHeaders = new Headers();
            returnHeaders.append("Ocp-Apim-Subscription-Key", this.apiKey)
            returnHeaders.append("Content-Type", "application/json");
            this.http.get(data.headers.get("Operation-Location"), {headers: returnHeaders})
              .map(res => res.json())
              .subscribe(dataInner => {
                console.log(dataInner.recognitionResult.lines)
                dataInner.recognitionResult.lines.forEach(element => {
                  element.words.forEach(textElement => {
                    console.log(textElement.text)
                    console.log(textElement.boundingBox)
                    console.log(Number(textElement.boundingBox[2]) - Number(textElement.boundingBox[0]))
                    this.words.push(textElement.text.toString())
                    this.width.push(Number(textElement.boundingBox[2]) - Number(textElement.boundingBox[0]))
                    this.height.push(textElement.boundingBox[3] - textElement.boundingBox[1])
                    this.left.push(textElement.boundingBox[0])
                    this.bottom.push(textElement.boundingBox[1])

                  })
                })
                console.log(this.words)
                console.log(this.width)
                console.log(this.height)
                console.log(this.left)
                console.log(this.bottom)
                this.checkSpelling(this.words);
                this.words = []
              });
          })
        },
        error => {


        });
    console.log(this.returnUrl)
    // $.ajax({
    //   url: this.apiUrl,
    //   beforeSend: function(xhrObj) {
    //     xhrObj.setRequestHeader("Content-Type", "application/octet-stream")
    //     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", this.apiKey)
    //   },
    //   type: "POST",
    //   data: this.makeblob(image.toDataURL()),
    //   processData: false
    // }).success(function(data, status){
    //   console.log(JSON.stringify(data));
    // }).error(function(xhr,status,err){
    //   console.log(err)
    // });

    console.log(this.words)
  }

  sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  makeblob = function (dataURL) {
    var base64Marker = ';base64,';
    if (dataURL.indexOf(base64Marker) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], {type: contentType});
    }
    var parts = dataURL.split(base64Marker);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }


  checkSpelling = function (wordList) {
    var firstDiv = true;
    console.log("Entered Spell Checker")
    console.log(wordList)
    var spellHeaders = new Headers()
    spellHeaders.append("X-Mashape-Key", "GLnIZKSk2VmshWEKUWXpIET7mDATp1zLCizjsnft6pnJnJi5dZ")
    spellHeaders.append("Content-Type", "application/json")
    var url = "https://montanaflynn-spellcheck.p.mashape.com/check/?text=" + wordList[0]
    for (var i = 1; i < wordList.length; i++){
      url = url + "+" + wordList[i]
    }
    this.http.get(url, {headers: spellHeaders})
      .map(res => res.json())
      .subscribe(dataInner => {
        console.log(dataInner)
        for (var k in dataInner.corrections) {
          var kVar = k.toString()
          for (var j = 0; j < wordList.length; j++) {
            if (wordList[j].toString() === k.toString()) {
              console.log(dataInner.corrections[k])
              console.log(dataInner.corrections[k][0])
              var eachProduct = {
                "name": wordList[j],
                "sug1": dataInner.corrections[k][0],
                "sug2": dataInner.corrections[k][1],
                "sug3": dataInner.corrections[k][2]
              }
              this.resultList.push(eachProduct)

            }
          }
        }

      });
    var currResultList = this.resultList
    this.loading.dismiss()
    this.popOverCtrl.create(PopoverPage, {currResultList}).present()
  }
}

export class resultData {
  public
}
