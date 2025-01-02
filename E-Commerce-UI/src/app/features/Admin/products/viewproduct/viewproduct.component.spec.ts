import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewproductComponent } from './viewproduct.component';

describe('ViewproductComponent', () => {
  let component: ViewproductComponent;
  let fixture: ComponentFixture<ViewproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
