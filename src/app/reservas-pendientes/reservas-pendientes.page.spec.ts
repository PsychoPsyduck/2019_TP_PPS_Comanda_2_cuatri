import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPendientesPage } from './reservas-pendientes.page';

describe('ReservasPendientesPage', () => {
  let component: ReservasPendientesPage;
  let fixture: ComponentFixture<ReservasPendientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservasPendientesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservasPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
