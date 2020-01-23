import { Injectable } from '@angular/core';
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
    streamHeight?: number
  ) => {
    let constraints: any = await this.getConstraints(
      facingMode,
      streamWidth,
      streamHeight
    );

    this.deviceInformation.cameraLog.push(
      'using constraints: ' + JSON.stringify(constraints)
    );

    return window.navigator.mediaDevices
      .getUserMedia(constraints)
      .catch(err => {
        this.deviceInformation.cameraLog.push(
          'default constraints failed, falling back to any resolution but still specifying facing mode. ' +
            err
        );

        constraints = {
          video: { facingMode }
        };
        this.deviceInformation.cameraLog.push(
          'using constraints: ' + JSON.stringify(constraints)
        );
        return window.navigator.mediaDevices.getUserMedia(constraints);
      })
      .catch(err => {
        this.deviceInformation.cameraLog.push(
          'facing mode not available, falling back to any camera. ' + err
        );
        constraints = { video: {} };
        this.deviceInformation.cameraLog.push(
          'using constraints: ' + JSON.stringify(constraints)
        );
        return window.navigator.mediaDevices.getUserMedia(constraints);
      });
  };

  public stopCamera = (stream: any) =>
    stream.getTracks().map((track: any) => track.stop && track.stop());

  private getConstraints = async (
    facingMode: FacingMode,
    streamWidth?: number,
    streamHeight?: number
  ) => {
    const constraints: any = {
      video: { facingMode },
      ...(streamWidth && { width: streamWidth }),
      ...(streamHeight && { height: streamHeight })
    };

    if (facingMode === 'environment') {
      const allAvailableDevices = await this.deviceInformation.getAvailbleMediaDevices();
      const device = allAvailableDevices
        .filter(d => d.kind === 'videoinput')
        // getting the correct back camera on p20 pro/p30 pro
        .find(d => d.label === 'camera2 2, facing back');

      // applying hard coded device id to constraints request
      if (device) {
        constraints.video.deviceId = device.deviceId;
      }
    }

    return constraints;
  };
}
