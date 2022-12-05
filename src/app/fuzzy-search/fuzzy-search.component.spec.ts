import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzySearchComponent } from './fuzzy-search.component';

describe('FuzzySearchComponent', () => {
  let component: FuzzySearchComponent;
  let fixture: ComponentFixture<FuzzySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuzzySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuzzySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
