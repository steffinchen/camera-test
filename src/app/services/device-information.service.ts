import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceInformationService {
  userAgent = navigator.userAgent || navigator.vendor || window['opera'];
  isAndroid = /android/i.test(this.userAgent);
  isIOS =
    (/iPad|iPhone|iPod/.test(this.userAgent) && !window['MSStream']) ||
    this.userAgent.indexOf('ipad') > -1 ||
    (this.userAgent.toLowerCase().indexOf('macintosh') > -1 &&
      'ontouchend' in document);
  isMobile =
    this.isAndroid ||
    this.isIOS ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  cameraLog = [];

  private availableDevices: MediaDeviceInfo[];

  constructor() {}

  async getAvailbleMediaDevices() {
    if (!this.availableDevices) {
      this.availableDevices = await navigator.mediaDevices.enumerateDevices();
    }
    return this.availableDevices;
  }
}
