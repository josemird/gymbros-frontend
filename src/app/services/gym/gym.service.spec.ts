import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { GymService } from './gym.service';

describe('GymService', () => {
  let service: GymService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      imports: [],
    });
    service = TestBed.inject(GymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
