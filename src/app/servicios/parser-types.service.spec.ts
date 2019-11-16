import { TestBed } from '@angular/core/testing';

import { ParserTypesService } from './parser-types.service';

describe('ParserTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParserTypesService = TestBed.get(ParserTypesService);
    expect(service).toBeTruthy();
  });
});
