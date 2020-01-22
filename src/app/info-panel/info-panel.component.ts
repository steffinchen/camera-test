import { Component, OnInit } from '@angular/core';
import { DeviceInformationService } from 'src/services/device-information.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit {
  constructor(public deviceInformation: DeviceInformationService) {}

  ngOnInit() {}
}
