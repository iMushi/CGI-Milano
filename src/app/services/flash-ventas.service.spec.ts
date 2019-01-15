import { TestBed, inject } from '@angular/core/testing';

import { FlashVentasService } from './flash-ventas.service';

describe('FlashVentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlashVentasService]
    });
  });

  it('should be created', inject([FlashVentasService], (service: FlashVentasService) => {
    expect(service).toBeTruthy();
  }));
});
