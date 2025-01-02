import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityStepComponent } from './quantity-step.component';

describe('QuantityStepComponent', () => {
  let component: QuantityStepComponent;
  let fixture: ComponentFixture<QuantityStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuantityStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
