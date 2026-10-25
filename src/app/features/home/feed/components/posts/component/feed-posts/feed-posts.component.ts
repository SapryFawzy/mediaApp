import { Component, inject, input, output, signal, WritableSignal } from '@angular/core';
import { Post } from '../../../../../../../core/models/post.interface';
import { PostComponent } from '../post/post.component';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';

@Component({
  selector: 'app-feed-posts',
  imports: [PostComponent],
  templateUrl: './feed-posts.component.html',
  styleUrl: './feed-posts.component.css',
})
export class FeedPostsComponent {
  private readonly postsService = inject(PostsService);
  posts: WritableSignal<Post[]> = signal([] as Post[]);

  ngOnInit(): void {
    this.getUserPosts();
  }

  getUserPosts() {
    this.postsService.getFeedPosts().subscribe((res: any) => {
      this.posts.set(res.data.posts);
    });
  }
}
