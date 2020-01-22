import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CameraService } from 'src/services/camera.service';

@Component({
  selector: 'app-camera-playground',
  templateUrl: './camera-playground.component.html',
  styleUrls: ['./camera-playground.component.scss']
})
export class CameraPlaygroundComponent implements OnInit, OnDestroy {
  stream: any;
  canvas = document.createElement('canvas');
  videoWidth: number;
  videoHeight: number;

  @ViewChild('video', { static: true }) video: ElementRef;
  @ViewChild('box', { static: true }) box: ElementRef;

  constructor(private camera: CameraService) {}

  async ngOnInit() {
    this.video.nativeElement.onloadedmetadata = () => {
      this.videoHeight = this.video.nativeElement.videoWidth;
      this.videoWidth = this.video.nativeElement.videoHeight;
      this.video.nativeElement.removeAttribute('controls');
    };
    try {
      this.stream =
        this.camera.activeEnvironmentStream ||
        (await this.camera.startCamera('environment'));
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
