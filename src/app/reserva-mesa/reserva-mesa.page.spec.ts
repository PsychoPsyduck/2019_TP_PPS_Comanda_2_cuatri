import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaMesaPage } from './reserva-mesa.page';

describe('ReservaMesaPage', () => {
  let component: ReservaMesaPage;
  let fixture: ComponentFixture<ReservaMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservaMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
