import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPostsComponent } from './feed-posts.component';

describe('FeedPostsComponent', () => {
  let component: FeedPostsComponent;
  let fixture: ComponentFixture<FeedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
