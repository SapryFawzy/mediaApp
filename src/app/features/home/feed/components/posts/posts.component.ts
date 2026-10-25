import {
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { PostsService } from '../../../../../core/Service/main/posts.service';
import { UserPostsComponent } from './component/user-posts/user-posts.component';
import { CommunityPostsComponent } from './component/community-posts/community-posts.component';
import { UserService } from '../../../../../core/Service/user/user.service';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Post } from '../../../../../core/models/post.interface';
import { BookedPostsComponent } from './component/bookedPosts/booked-posts/booked-posts.component';
import { FormErrorMsgComponent } from '../../../../../shared/ui/auth/form-error-msg/form-error-msg.component';
import { IUserProfile } from '../../../../../core/models/iuser-profile.interface';
import { FeedPostsComponent } from './component/feed-posts/feed-posts.component';

@Component({
  selector: 'app-posts',
  imports: [
    UserPostsComponent,
    CommunityPostsComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    BookedPostsComponent,
    FormErrorMsgComponent,
    FeedPostsComponent
],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  postesType: InputSignal<string> = input('');
  user: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  selectedImg!: File;
  contant = new FormControl('');
  privacy = new FormControl('public');
  posts: WritableSignal<Post[]> = signal([] as Post[]);
  showCreatePostError: WritableSignal<boolean> = signal(false);
  showEmojiPicker: WritableSignal<boolean> = signal(false);
  postTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('bindTextarea');
  emojis: string[] = [
    '😀',
    '😂',
    '😍',
    '🥰',
    '😎',
    '🤩',
    '😊',
    '😉',
    '😭',
    '😡',
    '🤔',
    '😴',
    '🥳',
    '🤗',
    '😇',
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🔥',
    '✨',
    '🎉',
    '💯',
    '👏',
    '🙌',
    '👍',
    '👎',
    '💪',
    '🙏',
    '💖',
    '💕',
    '💔',
    '🌹',
    '⭐',
    '🚀',
  ];

  ngOnInit(): void {
    this.getAllPosts();
    this.getUserProfileData();
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker.update((state) => !state);
  }

  insertEmoji(emoji: string): void {
    const textarea = this.postTextarea()?.nativeElement;

    if (!textarea) return;

    const value = this.contant.value ?? '';
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.slice(0, start) + emoji + value.slice(end);

    this.contant.setValue(newValue);
    this.showEmojiPicker.set(false);

    textarea.focus();
  }

  getUserProfileData() {
    this.userService.getUserProfileData().subscribe((res: any) => {
      this.user.set(res.data.user);
    });
  }

  getAllPosts() {
    this.postsService.getPosts().subscribe({
      next: (res: any) => {
        this.posts.set(res.data.posts);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onFileSelected(e: Event) {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length) {
        this.selectedImg = target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.selectedImg);
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          this.imgToDisplay.set(e.target?.result);
        };
      }
    }
  }

  cancelImg() {
    this.imgToDisplay.set(null);
    this.selectedImg = {} as File;
  }

  createPost(e: SubmitEvent, createPostForm: HTMLFormElement) {
    e.preventDefault();
    this.showCreatePostError.set(false);
    let myformData = new FormData();
    if (this.selectedImg) {
      myformData.append('image', this.selectedImg);
    }
    if (this.contant.value) {
      myformData.append('body', this.contant.value);
    }
    if (this.privacy.value) {
      myformData.append('privacy', this.privacy.value);
    }
    if (!this.selectedImg && !this.contant.value) {
      this.showCreatePostError.set(true);
      return;
    }
    this.postsService.createPost(myformData).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllPosts();
        createPostForm.reset();
        this.cancelImg();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
