import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient} from '@angular/common/http';

import { LikesComponent } from './likes.component';

describe('LikesComponent', () => {
  let component: LikesComponent;
  let fixture: ComponentFixture<LikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikesComponent],
      providers: [provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
