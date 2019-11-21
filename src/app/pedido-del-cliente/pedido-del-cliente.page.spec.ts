import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoDelClientePage } from './pedido-del-cliente.page';

describe('PedidoDelClientePage', () => {
  let component: PedidoDelClientePage;
  let fixture: ComponentFixture<PedidoDelClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoDelClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoDelClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
