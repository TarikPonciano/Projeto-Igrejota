import { TestBed, inject } from '@angular/core/testing';

import { DiasigrejotaService } from './diasigrejota.service';

describe('DiasigrejotaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiasigrejotaService]
    });
  });

  it('should be created', inject([DiasigrejotaService], (service: DiasigrejotaService) => {
    expect(service).toBeTruthy();
  }));
});
