import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestsFrendsComponent } from './suggests-frends.component';

describe('SuggestsFrendsComponent', () => {
  let component: SuggestsFrendsComponent;
  let fixture: ComponentFixture<SuggestsFrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestsFrendsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestsFrendsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
