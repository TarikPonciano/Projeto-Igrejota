import { TestBed, inject } from '@angular/core/testing';

import { BolsistaService } from './bolsista.service';

describe('BolsistaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BolsistaService]
    });
  });

  it('should be created', inject([BolsistaService], (service: BolsistaService) => {
    expect(service).toBeTruthy();
  }));
});
