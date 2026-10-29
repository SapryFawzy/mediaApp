import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { PostComponent } from '../post/post.component';
import { Post } from '../../../../../../../core/models/post.interface';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';

@Component({
  selector: 'app-community-posts',
  imports: [PostComponent],
  templateUrl: './community-posts.component.html',
  styleUrl: './community-posts.component.css',
})
export class CommunityPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  posts: WritableSignal<Post[]> = signal([] as Post[]);
  isNewPostAdded = input(false);

  constructor() {
    effect(() => {
      if (this.isNewPostAdded()) {
        this.getPosts();
      }
    });
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.postsService.getPosts().subscribe((res: any) => {
      this.posts.set(res.data.posts);
    });
  }
}
