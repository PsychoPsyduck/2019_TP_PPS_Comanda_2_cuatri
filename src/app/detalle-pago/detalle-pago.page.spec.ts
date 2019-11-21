import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPage } from './detalle-pago.page';

describe('DetallePagoPage', () => {
  let component: DetallePagoPage;
  let fixture: ComponentFixture<DetallePagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePagoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
