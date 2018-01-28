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

  constructor(public http: HttpClient) {
    console.log('Hello AzureProvider Provider');
  }

  sendImage(image) {
    var headers = new HttpHeaders();
    headers.set("Ocp-Apim-Subscription-Key", this.apiKey);
    headers.set("Content-Type", "application/octet-stream");

    return new Promise(resolve => {
      this.http.post(this.apiUrl, image, {headers: headers})
        .subscribe(data => {
          console.log(data);
          resolve(data);
        });
    });
  }

}
