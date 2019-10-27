import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDuenoPage } from './abm-dueno.page';

describe('AbmDuenoPage', () => {
  let component: AbmDuenoPage;
  let fixture: ComponentFixture<AbmDuenoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmDuenoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmDuenoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
