import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';
import { FacingMode } from 'src/app/facing-mode.model';
import { DeviceInformationService } from '../services/device-information.service';

@Component({
  selector: 'app-camera-playground',
  templateUrl: './camera-playground.component.html',
  styleUrls: ['./camera-playground.component.scss']
})
export class CameraPlaygroundComponent implements OnInit, OnDestroy {
  FacingModeEnum = FacingMode;
  stream: any;
  canvas = document.createElement('canvas');
  videoWidth: number;
  videoHeight: number;

  availableCameras: MediaDeviceInfo[];

  model = {
    requestedStreamWidth: 1920,
    requestedStreamHeight: 1920,
    facingMode: FacingMode.Environment,
    labelFilter: ''
  };

  @ViewChild('video', { static: true }) video: ElementRef;
  @ViewChild('box', { static: true }) box: ElementRef;

  constructor(private camera: CameraService, private deviceInformation: DeviceInformationService) {}

  async ngOnInit() {
    this.availableCameras = (await this.deviceInformation.getAvailbleMediaDevices()).filter(
      d => d.kind === 'videoinput'
    );

    this.video.nativeElement.onloadedmetadata = () => {
      this.videoWidth = this.video.nativeElement.videoWidth;
      this.videoHeight = this.video.nativeElement.videoHeight;
      this.video.nativeElement.removeAttribute('controls');
    };
  }

  async onSubmit() {
    try {
      if (this.camera.activeEnvironmentStream) {
        this.camera.stopCamera(this.stream);
      }
      this.stream = await this.camera.startCamera(
        this.model.facingMode,
        this.model.requestedStreamWidth,
        this.model.requestedStreamHeight,
        this.model.labelFilter
      );
      this.camera.activeEnvironmentStream = this.stream;
      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.camera.stopCamera(this.stream);
  }
}
