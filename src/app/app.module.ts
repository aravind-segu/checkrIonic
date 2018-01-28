import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { Diagnostic } from '@ionic-native/diagnostic';
import {CameraPreview, CameraPreviewOptions} from "@ionic-native/camera-preview";
import {AndroidFullScreen} from '@ionic-native/android-full-screen';
import { IonicStorageModule } from '@ionic/storage';
import { AzureProvider } from '../providers/azure/azure';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Diagnostic,
    CameraPreview,
    SplashScreen,
    AndroidFullScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AzureProvider
  ]
})
export class AppModule {}
