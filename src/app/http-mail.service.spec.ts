import { TestBed } from '@angular/core/testing';

import { HttpMailService } from './http-mail.service';

describe('HttpMailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpMailService = TestBed.get(HttpMailService);
    expect(service).toBeTruthy();
  });
});
