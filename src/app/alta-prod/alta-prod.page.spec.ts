import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaProdPage } from './alta-prod.page';

describe('AltaProdPage', () => {
  let component: AltaProdPage;
  let fixture: ComponentFixture<AltaProdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaProdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaProdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
