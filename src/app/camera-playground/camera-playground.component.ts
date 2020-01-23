import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';
import { FacingMode } from 'src/app/facing-mode.model';

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

  model = {
    requestedStreamWidth: 1920,
    requestedStreamHeight: 1920,
    facingMode: FacingMode.Environment
  };

  @ViewChild('video', { static: true }) video: ElementRef;
  @ViewChild('box', { static: true }) box: ElementRef;

  constructor(private camera: CameraService) {}

  ngOnInit() {
    this.video.nativeElement.onloadedmetadata = () => {
      this.videoHeight = this.video.nativeElement.videoWidth;
      this.videoWidth = this.video.nativeElement.videoHeight;
      this.video.nativeElement.removeAttribute('controls');
    };
  }

  async onSubmit() {
    try {
      this.stream = await this.camera.startCamera(
        this.model.facingMode,
        this.model.requestedStreamWidth,
        this.model.requestedStreamHeight
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
