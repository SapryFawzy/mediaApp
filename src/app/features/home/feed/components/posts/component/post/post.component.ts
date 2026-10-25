import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { Post } from '../../../../../../../core/models/post.interface';
import { CommentsComponent } from '../comments/comments.component';
import { FormatDatePipe } from '../../../../../../../shared/pipes/format-date-pipe';
import { UserService } from '../../../../../../../core/Service/user/user.service';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IUserProfile } from '../../../../../../../core/models/iuser-profile.interface';

@Component({
  selector: 'app-post',
  imports: [CommentsComponent, FormatDatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);
  postData = input({} as Post);
  togglePostMenuFlag: WritableSignal<boolean> = signal(false);
  user: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  udatePosts = output<boolean>();
  showPostEditor: WritableSignal<boolean> = signal(false);
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  selectedImg: File | null = null;
  contant = new FormControl('');
  privacy = new FormControl('public');
  posts: WritableSignal<Post[]> = signal([] as Post[]);
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
  shareText: FormControl = new FormControl('');
  selectedPostToShare: WritableSignal<Post> = signal({} as Post);
  togglePostSharing: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
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

  onFileSelectedInEdit(e: Event) {
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
    this.selectedImg = null;
  }

  togglePostMenu() {
    this.togglePostMenuFlag.update((state) => !state);
  }

  deletePost(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.udatePosts.emit(true);
    });
  }

  savePost(id: string) {
    this.postsService.savePost(id).subscribe(() => {
      this.udatePosts.emit(true);
    });
  }

  editPost(id: string, form: HTMLFormElement, e: SubmitEvent) {
    e.preventDefault();
    let myformData = new FormData();
    console.log(this.selectedImg);

    if (this.selectedImg) {
      myformData.append('image', this.selectedImg);
    }
    if (this.contant.value) {
      myformData.append('body', this.contant.value);
    } else {
      myformData.append('body', '');
    }
    if (this.privacy.value) {
      myformData.append('privacy', this.privacy.value);
    }
    this.postsService.editePost(id, myformData).subscribe(() => {
      this.udatePosts.emit(true);
      form.reset();
      this.closePostEditor();
    });
  }

  closePostEditorOnTouch(e: Event): void {
    e?.stopPropagation();
    const ele = e.target as HTMLDivElement;
    if (!ele) return;
    const eleId = ele.id;
    if (eleId !== 'model') return;
    this.closePostEditor();
  }

  closePostEditor(): void {
    this.showPostEditor.set(false);
    this.cancelImg();
    this.contant = new FormControl('');
    this.privacy = new FormControl('public');
  }

  getPostData(): void {
    this.postsService.getSinglePost(this.postData()._id).subscribe((res: any) => {
      const data = res.data.post;
      this.contant.setValue(data.body ?? '');
      this.privacy.setValue(data.privacy ?? 'public');
      this.imgToDisplay.set(data.image ?? null);
      this.selectedImg = null;
    });
  }

  sharePost() {
    const formData = new FormData();
    formData.append('body', this.shareText.value);
    this.postsService.sharePost(this.selectedPostToShare()._id, formData).subscribe(() => {
      this.closePostSharingPopup();
      this.udatePosts.emit(true);
    });
  }

  togglePostSharingPopup(postId: string) {
    this.togglePostSharing.update((state) => !state);
    this.postsService.getSinglePost(postId).subscribe((res: any) => {
      this.selectedPostToShare.set(res.data.post);
    });
  }

  closePostSharingPopup() {
    this.togglePostSharing.set(false);
    this.selectedPostToShare.set({} as Post);
  }

  getUserProfileData() {
    this.userService.getUserProfileData().subscribe((res: any) => {
      this.user.set(res.data.user);
    });
  }

  likeAndUnlikeComment() {
    this.postsService.likeAndUlikePost(this.postData()._id).subscribe(() => {
      this.udatePosts.emit(true);
    });
  }
}
