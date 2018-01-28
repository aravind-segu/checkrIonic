import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
/*
  Generated class for the AzureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
interface resultData {
  word: string,
  width: number,
  height: number,
  left: number,
  bottom: number
}

@Injectable()
export class AzureProvider {

  apiUrl = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?handwriting=true';
  apiKey = 'ae6a8b7ae7a64d84ba7aab7678ad2174';
  returnUrl = '';
  words = [];
  results = []

  constructor(public http: Http) {
    console.log('Hello AzureProvider Provider');
  }
  sendImage(image) {
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
                    this.words.push(textElement.text.toString())
                  })
                })
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
        for (var k in dataInner.corrections) console.log(k)

      });
  }
}
