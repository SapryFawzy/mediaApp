import { Component, input, output} from '@angular/core';
import { PostComponent } from '../post/post.component';
import { Post } from '../../../../../../../core/models/post.interface';

@Component({
  selector: 'app-community-posts',
  imports: [PostComponent],
  templateUrl: './community-posts.component.html',
  styleUrl: './community-posts.component.css',
})
export class CommunityPostsComponent {
  posts = input([] as Post[]);
  udatePosts = output<boolean>();

  updatePosts(){
    this.udatePosts.emit(true);
  }
}
