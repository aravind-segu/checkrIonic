import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AzureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AzureProvider {

  apiUrl =  'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true';
  apiKey = 'ae6a8b7ae7a64d84ba7aab7678ad2174';
  returnUrl = '';

  constructor(public http: HttpClient) {
    console.log('Hello AzureProvider Provider');
  }
  sendImage(image) {
    var headers = new HttpHeaders();
    var returnUrl;
    headers = headers.set("Ocp-Apim-Subscription-Key", this.apiKey).set("Content-Type", "application/octet-stream").set('responseType', 'text');

     this.http.post(this.apiUrl, this.makeblob("data:image/png;base64," + image.toString('base64')), {headers: headers})
        .subscribe(data => {
          console.log("Entered Subscribe")
          //console.log(data.headers.get("Operation-Location"));
        },
          error => {
            console.log(error.headers.get("Operation-Location"))
            returnUrl = (error.headers.get("Operation-Location")).toString()

          });
    console.log(this.returnUrl)
    // var returnHeaders = new HttpHeaders();
    // returnHeaders = returnHeaders.set("Ocp-Apim-Subscription-Key", this.apiKey).set("Content-Type", "application/json");
    // this.http.get(this.returnUrl, {headers: returnHeaders})
    //   .subscribe(data => {
    //     console.log(data)
    //   });
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
  }

  makeblob = function(dataURL) {
    var base64Marker = ';base64,';
    if(dataURL.indexOf(base64Marker) == -1){
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

    return new Blob([uInt8Array], { type: contentType });
  }

}
