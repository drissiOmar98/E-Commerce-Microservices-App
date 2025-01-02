import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopbarComponent } from './app.topbar.component';

describe('AppTopbarComponent', () => {
  let component: AppTopbarComponent;
  let fixture: ComponentFixture<AppTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
