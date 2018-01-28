import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PopoverPage } from '../pages/popover/popover'
import { Diagnostic } from '@ionic-native/diagnostic';
import {CameraPreview, CameraPreviewOptions} from "@ionic-native/camera-preview";
import {AndroidFullScreen} from '@ionic-native/android-full-screen';
import { IonicStorageModule } from '@ionic/storage';
import { AzureProvider } from '../providers/azure/azure';
import {} from '../theme/angular.maphighlight.min.js'
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverPage
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
