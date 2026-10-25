import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../core/Service/main/posts.service';
import { UserService } from '../../../core/Service/user/user.service';
import { IUserProfile } from '../../../core/models/iuser-profile.interface';
import { Post } from '../../../core/models/post.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  userProfileData: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  userposts: WritableSignal<Post[]> = signal([]);
  userID: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getUserProfileData();
    // this.getUserPosts();
  }

  getUserId(): void {
    this.activatedRoute.paramMap.subscribe((res) => {
      if (res.get('id') !== null) {
        this.userID.set(res.get('id')!);
      }
    });
  }

  // getUserPosts() {
  //   this.postsService.getUserDetailPosts('').subscribe((res: any) => {
  //     this.userposts.set(res.data.posts);
  //   });
  // }

  getUserProfileData() {
    this.userService.getUserDetailProfileData(this.userID()).subscribe((res: any) => {
      this.userProfileData.set(res.data.user);
    });
  }
}
