import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarMesaPage } from './reservar-mesa.page';

describe('ReservarMesaPage', () => {
  let component: ReservarMesaPage;
  let fixture: ComponentFixture<ReservarMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservarMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservarMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
