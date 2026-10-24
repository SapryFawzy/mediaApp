import { Component, inject, output, signal, WritableSignal } from '@angular/core';
import { PostComponent } from '../feed/components/posts/component/post/post.component';
import { Post } from '../../../core/models/post.interface';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../../core/auth/services/main/posts.service';

@Component({
  selector: 'app-post-details',
  imports: [PostComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent {
  private readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  post: WritableSignal<Post> = signal({} as Post);
  udatePosts = output<boolean>();
  postId: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getPostDetails();
    console.log(this.postId());
  }

  getPostDetails() {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        const id = res.get('id');

        if (id) {
          this.postId.set(id);

          this.postsService.getSinglePost(id).subscribe((res: any) => {
            this.post.set(res.data.post);
          });
        }
      },
    });
  }

  updatePosts() {
    this.udatePosts.emit(true);
  }

  goBack() {
    this.location.back();
  }
}
