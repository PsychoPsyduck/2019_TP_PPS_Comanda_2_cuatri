import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanMesaPage } from './scan-mesa.page';

describe('ScanMesaPage', () => {
  let component: ScanMesaPage;
  let fixture: ComponentFixture<ScanMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
