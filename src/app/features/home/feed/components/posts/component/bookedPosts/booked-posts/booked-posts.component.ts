import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { PostComponent } from '../../post/post.component';
import { Post } from '../../../../../../../../core/models/post.interface';
import { PostsService } from '../../../../../../../../core/Service/main/posts.service';

@Component({
  selector: 'app-booked-posts',
  imports: [PostComponent],
  templateUrl: './booked-posts.component.html',
  styleUrl: './booked-posts.component.css',
})
export class BookedPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  posts: WritableSignal<Post[]> = signal([]);

  ngOnInit(): void {
    this.getSavedPosts();
  }

  getSavedPosts() {
    this.postsService.getSavedPosts().subscribe((res: any) => {
      this.posts.set(res.data.bookmarks);
    });
  }
}
