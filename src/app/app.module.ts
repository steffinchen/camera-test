import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraPlaygroundComponent } from './camera-playground/camera-playground.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';

@NgModule({
  declarations: [AppComponent, CameraPlaygroundComponent, InfoPanelComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
