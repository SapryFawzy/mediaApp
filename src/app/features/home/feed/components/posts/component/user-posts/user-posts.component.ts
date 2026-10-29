import { Component, effect, inject, input, output, signal, WritableSignal } from '@angular/core';
import { Post } from '../../../../../../../core/models/post.interface';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-user-posts',
  imports: [PostComponent],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css',
})
export class UserPostsComponent {
  private readonly postsService = inject(PostsService);
  posts: WritableSignal<Post[]> = signal([]);
  isNewPostAdded = input(false);

  constructor() {
    effect(() => {
      if (this.isNewPostAdded()) {
        this.getUserPosts();
      }
    });
  }

  ngOnInit(): void {
    this.getUserPosts();
  }

  updatePosts() {
    this.getUserPosts();
  }

  getUserPosts() {
    this.postsService.getUserPosts().subscribe((res: any) => {
      this.posts.set(res.data.posts);
    });
  }
}
