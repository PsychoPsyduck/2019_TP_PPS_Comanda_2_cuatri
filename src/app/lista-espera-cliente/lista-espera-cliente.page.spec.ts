import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEsperaClientePage } from './lista-espera-cliente.page';

describe('ListaEsperaClientePage', () => {
  let component: ListaEsperaClientePage;
  let fixture: ComponentFixture<ListaEsperaClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEsperaClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEsperaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
