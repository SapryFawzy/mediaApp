import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestsFrendsPageComponent } from './suggests-frends-page.component';

describe('SuggestsFrendsPageComponent', () => {
  let component: SuggestsFrendsPageComponent;
  let fixture: ComponentFixture<SuggestsFrendsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestsFrendsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestsFrendsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
