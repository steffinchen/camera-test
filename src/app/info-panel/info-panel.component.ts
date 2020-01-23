import { Component, OnInit } from '@angular/core';
import { DeviceInformationService } from 'src/app/services/device-information.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit {
  availableMediaDeviceInfo = [];

  constructor(public deviceInformation: DeviceInformationService) {}

  async ngOnInit() {
    this.availableMediaDeviceInfo = (
      await this.deviceInformation.getAvailbleMediaDevices()
    ).map(
      d =>
        'kind: ' + d.kind + ', deviceId: ' + d.deviceId + ', label :' + d.label
    );
  }
}
