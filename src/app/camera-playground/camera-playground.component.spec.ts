import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraPlaygroundComponent } from './camera-playground.component';

describe('CameraPlaygroundComponent', () => {
  let component: CameraPlaygroundComponent;
  let fixture: ComponentFixture<CameraPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
