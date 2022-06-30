/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PlatformService } from './platform.service';

describe('Service: Platform', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatformService],
    });
  });

  it('should ...', inject([PlatformService], (service: PlatformService) => {
    expect(service).toBeTruthy();
  }));
});
