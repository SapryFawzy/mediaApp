import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';
import { Icomment } from '../../../../../../../core/models/icomment.interface';
import { FormatDatePipe } from '../../../../../../../shared/pipes/format-date-pipe';
import { UserService } from '../../../../../../../core/Service/user/user.service';
import { IUserProfile } from '../../../../../../../core/models/iuser-profile.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMsgComponent } from '../../../../../../../shared/ui/auth/form-error-msg/form-error-msg.component';

@Component({
  selector: 'app-comments',
  imports: [FormatDatePipe, ReactiveFormsModule, FormErrorMsgComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  comments: WritableSignal<Icomment[]> = signal([]);
  postId = input('');
  user: WritableSignal<WritableSignal<IUserProfile>> = signal(this.userService.user);
  noCommenting: WritableSignal<boolean> = signal(false);
  contant: FormControl = new FormControl('');
  newContant: FormControl = new FormControl('');
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  editeImgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  selectedImage: File | null = null;
  showEmojiPicker: WritableSignal<boolean> = signal(false);
  commentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('bindTextarea');

  repalyImgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  repalySelectedImage: File | null = null;
  repaycommentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('replaybindTextarea');
  replaycontant: FormControl = new FormControl('');
  showrepalyEmojiPicker: WritableSignal<boolean> = signal(false);
  showCreateReplayCommentError: WritableSignal<boolean> = signal(false);

  showPostEditor: WritableSignal<boolean> = signal(false);
  toggleCommentMenuFlag: WritableSignal<boolean> = signal(false);
  currentCommentId: WritableSignal<string> = signal('');
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
  showCreateCommentError: WritableSignal<boolean> = signal(false);
  replays: WritableSignal<Icomment[]> = signal([] as Icomment[]);
  showReplays: WritableSignal<boolean> = signal(false);
  activeCommentMenu = signal<string | null>(null);
  showUpdateCommentError: WritableSignal<boolean> = signal(false);

  showEditCommentPopup: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.getPostComment();
  }

  getPostComment(): void {
    this.postsService.getPostComment(this.postId()).subscribe((res: any) => {
      this.comments.set(res.data.comments);
    });
  }

  getCommentsReplays(commentId: string): void {
    this.showReplays.update((vale) => !vale);
    if (!this.showReplays()) return;
    this.postsService.getCommentReplays(this.postId(), commentId).subscribe((res: any) => {
      this.replays.set(res.data.replies);
    });
  }

  deleteComment(commentId: string): void {
    this.postsService.deleteComment(this.postId(), commentId).subscribe(() => {
      this.getPostComment();
    });
  }

  updateComment(): void {
    this.toggleCommentMenuFlag.set(false);
    if (this.showUpdateCommentError()) this.showUpdateCommentError.set(false);

    const formData = new FormData();

    if (this.newContant.value) {
      formData.append('content', this.newContant.value);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (!this.newContant.value && !this.selectedImage) {
      this.showUpdateCommentError.set(true);
      return;
    } else {
    }
    this.postsService
      .upDateComment(this.postId(), this.currentCommentId(), formData)
      .subscribe(() => {
        this.getPostComment();
        this.closeEditCommentPopup();
      });
  }

  closeEditCommentPopup(): void {
    this.showEditCommentPopup.set(false);
    this.resetEditCommentPopup();
  }

  private resetEditCommentPopup(): void {
    this.contant.setValue('');
    this.cancelImg();
  }

  toggleEditCommentPopup(): void {
    this.showEditCommentPopup.update((state) => !state);
  }

  toggleEmojiPicker(place: string = ''): void {
    if (place === 'replay') this.showrepalyEmojiPicker.update((state) => !state);
    else this.showEmojiPicker.update((state) => !state);
  }

  insertEmoji(emoji: string, place: string = ''): void {
    let textarea;
    let value;

    if (place === 'replay') textarea = this.repaycommentTextarea()?.nativeElement;
    else textarea = this.commentTextarea()?.nativeElement;

    if (!textarea) return;

    if (place === 'replay') value = this.replaycontant.value ?? '';
    else value = this.contant.value ?? '';

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.slice(0, start) + emoji + value.slice(end);

    if (place === 'replay') {
      this.replaycontant.setValue(newValue);
      this.showrepalyEmojiPicker.set(false);
    } else {
      this.contant.setValue(newValue);
      this.showEmojiPicker.set(false);
    }
    textarea.focus();
  }

  onFileSelected(e: Event, place: string = '') {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      const fileReader = new FileReader();
      if (target.files && target.files.length) {
        if (place === 'replay') {
          this.repalySelectedImage = target.files[0];
          fileReader.readAsDataURL(this.repalySelectedImage!);
        } else {
          this.selectedImage = target.files[0];
          fileReader.readAsDataURL(this.selectedImage!);
        }

        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          if (this.showEditCommentPopup()) {
            this.editeImgToDisplay.set(e.target?.result);
          } else {
            if (place === 'replay') this.repalyImgToDisplay.set(e.target?.result);
            else this.imgToDisplay.set(e.target?.result);
          }
        };
      }
    }
  }

  cancelImg() {
    if (this.showEditCommentPopup()) {
      this.editeImgToDisplay.set(null);
    } else {
      this.imgToDisplay.set(null);
      this.repalyImgToDisplay.set(null);
    }
    this.selectedImage = null;
  }

  createComment(e: SubmitEvent, form: HTMLFormElement) {
    e.preventDefault();
    this.showCreateCommentError.set(false);

    const myFormData = new FormData();

    if (this.contant.value) {
      myFormData.append('content', this.contant.value);
    }
    if (this.selectedImage) {
      myFormData.append('image', this.selectedImage);
    }
    if (!this.contant.value && !this.selectedImage) {
      this.showCreateCommentError.set(true);
      return;
    }

    this.postsService.createCommentOnPost(this.postId(), myFormData).subscribe(() => {
      this.getPostComment();
      this.contant.setValue('');
      form.reset();
      this.cancelImg();
    });
  }

  createReplay(e: SubmitEvent, form: HTMLFormElement, commentId: string) {
    e.preventDefault();
    this.showCreateReplayCommentError.set(false);

    const myFormData = new FormData();

    if (this.replaycontant.value) {
      myFormData.append('content', this.replaycontant.value);
    }
    if (this.repalySelectedImage) {
      myFormData.append('image', this.repalySelectedImage);
    }
    if (!this.replaycontant.value && !this.repalySelectedImage) {
      this.showCreateReplayCommentError.set(true);
      return;
    }

    this.postsService.createCommentReplays(this.postId(), commentId, myFormData).subscribe(() => {
      this.showReplays.set(false);
      this.getPostComment();
      this.replaycontant.setValue('');
      form.reset();
      this.cancelImg();
    });
  }

  onFileSelectedInEdit(e: Event) {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length) {
        this.selectedImage = target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.selectedImage);
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          this.imgToDisplay.set(e.target?.result);
        };
      }
    }
  }

  toggleCommentMenu(commentId: string) {
    this.currentCommentId.set(commentId);
    this.toggleCommentMenuFlag.update((state) => !state);
  }

  deletePost(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
    });
  }

  editPost(id: string, form: HTMLFormElement, e: SubmitEvent) {
    e.preventDefault();
    let myformData = new FormData();
    console.log(this.selectedImage);

    if (this.selectedImage) {
      myformData.append('image', this.selectedImage);
    }
    if (this.contant.value) {
      myformData.append('body', this.contant.value);
    } else {
      myformData.append('body', '');
    }

    this.postsService.editePost(id, myformData).subscribe(() => {
      // this.udatePosts.emit(true);
      form.reset();
      this.closeCommentEditor();
    });
  }

  closeCommentEditorOnTouch(e: Event): void {
    e?.stopPropagation();
    const ele = e.target as HTMLDivElement;
    if (!ele) return;
    const eleId = ele.id;
    if (eleId !== 'model') return;
    this.closeCommentEditor();
  }

  closeCommentEditor(): void {
    this.showPostEditor.set(false);
    this.cancelImg();
    this.contant = new FormControl('');
  }

  likeAndUnlikeComment(comentId: string) {
    this.postsService.likeAndUlikeComment(this.postId(), comentId).subscribe(() => {
      this.getPostComment();
    });
  }
}
