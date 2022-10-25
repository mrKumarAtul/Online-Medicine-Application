import { TestBed } from '@angular/core/testing';

import { MedicineListService } from './medicine-list.service';

describe('MedicineListService', () => {
  let service: MedicineListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
