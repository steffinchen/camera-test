import { Injectable } from '@angular/core';
import _ from 'lodash';

import { DeviceInformationService } from './device-information.service';
import { FacingMode } from '../facing-mode.model';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  activeEnvironmentStream: any;

  constructor(private deviceInformation: DeviceInformationService) {}

  public startCamera = async (
    facingMode: FacingMode,
    streamWidth?: number,
    streamHeight?: number,
    labelFilter?: string
  ) => {
    let constraints: any = await this.getConstraints(facingMode, streamWidth, streamHeight, labelFilter);

    this.deviceInformation.cameraLog.push('using constraints: ' + JSON.stringify(constraints));

    return window.navigator.mediaDevices
      .getUserMedia(constraints)
      .catch(err => {
        this.deviceInformation.cameraLog.push('specified constraints failed, droping device id. ' + err);

        constraints = _.omit(constraints, 'video.deviceId');
        this.deviceInformation.cameraLog.push('using constraints: ' + JSON.stringify(constraints));
        return window.navigator.mediaDevices.getUserMedia(constraints);
      })
      .catch(err => {
        this.deviceInformation.cameraLog.push('specified constraints failed, droping resolution ' + err);

        constraints = _.omit(constraints, ['video.width', 'video.height']);
        this.deviceInformation.cameraLog.push('using constraints: ' + JSON.stringify(constraints));
        return window.navigator.mediaDevices.getUserMedia(constraints);
      })
      .catch(err => {
        this.deviceInformation.cameraLog.push('facing mode not available, falling back to any camera. ' + err);
        constraints = { video: {} };
        this.deviceInformation.cameraLog.push('using constraints: ' + JSON.stringify(constraints));
        return window.navigator.mediaDevices.getUserMedia(constraints);
      })
      .catch(err => {
        this.deviceInformation.cameraLog.push('could not start camera, giving up ' + err);
      });
  };

  public stopCamera = (stream: any) => {
    this.deviceInformation.cameraLog = [];
    stream.getTracks().map((track: any) => track.stop && track.stop());
  };

  private getConstraints = async (
    facingMode: FacingMode,
    streamWidth?: number,
    streamHeight?: number,
    labelFilter?: string
  ) => {
    const constraints: any = {
      video: { facingMode },
      ...(streamWidth && { width: streamWidth }),
      ...(streamHeight && { height: streamHeight })
    };

    if (labelFilter) {
      const allAvailableDevices = await this.deviceInformation.getAvailbleMediaDevices();
      const device = allAvailableDevices.filter(d => d.kind === 'videoinput').find(d => d.label === labelFilter);
      console.log('TCL: CameraService -> constructor -> device', device);
      if (device) {
        constraints.video.deviceId = device.deviceId;
      }
    }

    return constraints;
  };
}
