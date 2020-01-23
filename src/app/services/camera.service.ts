import { Injectable } from '@angular/core';
import { DeviceInformationService } from './device-information.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  activeEnvironmentStream: any;

  constructor(private deviceInformation: DeviceInformationService) {}

  public startCamera = async (
    facingMode: 'user' | 'environment',
    streamWidth?: number,
    streamHeight?: number
  ) => {
    const constraints: any = await this.getConstraints(
      facingMode,
      streamWidth,
      streamHeight
    );
    console.log(
      'TCL: CameraService -> constructor -> constraints',
      constraints
    );

    return window.navigator.mediaDevices
      .getUserMedia(constraints)
      .catch(err => {
        console.warn(
          'default constraints failed, falling back to any resolution but still specifying facing mode',
          err
        );
        return window.navigator.mediaDevices.getUserMedia({
          video: { facingMode }
        });
      })
      .catch(err => {
        console.warn(
          'facing mode not available, falling back to any camera',
          err
        );
        return window.navigator.mediaDevices.getUserMedia({ video: {} });
      });
  };

  public stopCamera = (stream: any) =>
    stream.getTracks().map((track: any) => track.stop && track.stop());

  private getConstraints = async (
    facingMode: 'user' | 'environment',
    streamWidth?: number,
    streamHeight?: number
  ) => {
    const constraints: any = {
      video: { facingMode },
      ...(streamWidth && { width: streamWidth }),
      ...(streamHeight && { height: streamHeight })
    };

    if (facingMode === 'environment') {
      const allAvailableDevices = await navigator.mediaDevices.enumerateDevices();
      const device = allAvailableDevices
        .map(d => {
          console.log('device: ', d);
          return d;
        })
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
