import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryStepComponent } from './subcategory-step.component';

describe('SubcategoryStepComponent', () => {
  let component: SubcategoryStepComponent;
  let fixture: ComponentFixture<SubcategoryStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
