import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAnonimoPage } from './ingreso-anonimo.page';

describe('IngresoAnonimoPage', () => {
  let component: IngresoAnonimoPage;
  let fixture: ComponentFixture<IngresoAnonimoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoAnonimoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoAnonimoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
