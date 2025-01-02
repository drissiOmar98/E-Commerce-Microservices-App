import { TestBed } from '@angular/core/testing';

import { SubcategoryService } from './subcategory.service';

describe('SubcategoryService', () => {
  let service: SubcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
