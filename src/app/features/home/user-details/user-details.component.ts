import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../core/Service/main/posts.service';
import { UserService } from '../../../core/Service/user/user.service';
import { IUserProfile } from '../../../core/models/iuser-profile.interface';
import { Post } from '../../../core/models/post.interface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PostComponent } from '../feed/components/posts/component/post/post.component';

@Component({
  selector: 'app-user-details',
  imports: [PostComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly location = inject(Location);
  private readonly postsService = inject(PostsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  userProfileData: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  userposts: WritableSignal<Post[]> = signal([]);
  userID: WritableSignal<string> = signal('');
  isFollowing: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    this.activatedRoute.paramMap.subscribe((res) => {
      if (res.get('id') !== null) {
        this.userID.set(res.get('id')!);
        this.getUserProfileData();
      }
    });
  }

  followAndUnFollow() {
    this.userService.followAndUnFollow(this.userID()).subscribe(() => {
      this.getUserProfileData();
    });
  }

  getUserProfileData() {
    this.userService.getUserDetailProfileData(this.userID()).subscribe((res: any) => {
      this.userProfileData.set(res.data.user);
      this.isFollowing.set(res.data.isFollowing);
      this.getUserPosts();
    });
  }

  goBack() {
    this.location.back();
  }

  getUserPosts() {
    this.postsService.getAllUserPosts(this.userID()).subscribe((res: any) => {
      this.userposts.set(res.data.posts);
    });
  }
}
