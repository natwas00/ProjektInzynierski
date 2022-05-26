import { TestBed } from '@angular/core/testing';

import { FlascardsService } from './flascards.service';

describe('FlascardsService', () => {
  let service: FlascardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlascardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
