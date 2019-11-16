import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalClientePage } from './principal-cliente.page';

describe('PrincipalClientePage', () => {
  let component: PrincipalClientePage;
  let fixture: ComponentFixture<PrincipalClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
