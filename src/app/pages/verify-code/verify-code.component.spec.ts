import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient} from '@angular/common/http';

import { ResetVerifyCodeComponent } from './verify-code.component';

describe('VerifyCodeComponent', () => {
  let component: ResetVerifyCodeComponent;
  let fixture: ComponentFixture<ResetVerifyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetVerifyCodeComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetVerifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
