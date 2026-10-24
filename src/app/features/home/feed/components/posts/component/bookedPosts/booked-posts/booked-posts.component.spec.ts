import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedPostsComponent } from './booked-posts.component';

describe('BookedPostsComponent', () => {
  let component: BookedPostsComponent;
  let fixture: ComponentFixture<BookedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookedPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
