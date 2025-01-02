import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityStepControlComponent } from './quantity-step-control.component';

describe('QuantityStepControlComponent', () => {
  let component: QuantityStepControlComponent;
  let fixture: ComponentFixture<QuantityStepControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuantityStepControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
