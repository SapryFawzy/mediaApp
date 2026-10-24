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
import { PostsService } from '../../../../../../../core/auth/services/main/posts.service';
import { Icomment } from '../../../../../../../core/models/icomment.interface';
import { FormatDatePipe } from '../../../../../../../shared/pipes/format-date-pipe';
import { UserService } from '../../../../../../../core/auth/services/user/user.service';
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
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  selectedImage: File | null = null;
  showEmojiPicker: WritableSignal<boolean> = signal(false);
  commentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('bindTextarea');
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
  replays: WritableSignal<Icomment[]> = signal({} as Icomment[]);
  showReplays: WritableSignal<boolean> = signal(false);
  activeCommentMenu = signal<string | null>(null);

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
    this.showEditCommentPopup.set(true);
    const text = this.editCommentText().trim();
    const image = this.editCommentImage();

    if (!text && !image) return;

    const formData = new FormData();
    formData.append('content', text);

    if (image) {
      formData.append('image', image);
    }

    this.isUpdatingComment.set(true);

    this.postsService
      .upDateComment(this.postId(), this.currentCommentId(), formData)
      .subscribe(() => {
        this.getPostComment();
        this.isUpdatingComment.set(false);
        this.closeEditCommentPopup();
      });
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker.update((state) => !state);
  }

  insertEmoji(emoji: string): void {
    const textarea = this.commentTextarea()?.nativeElement;

    if (!textarea) return;

    const value = this.contant.value ?? '';
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.slice(0, start) + emoji + value.slice(end);

    this.contant.setValue(newValue);
    this.showEmojiPicker.set(false);

    textarea.focus();
  }

  onFileSelected(e: Event) {
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

  cancelImg() {
    this.imgToDisplay.set(null);
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
    } else {
      this.postsService.createCommentOnPost(this.postId(), myFormData).subscribe(() => {
        this.getPostComment();
        this.contant.setValue('');
        form.reset();
        this.cancelImg();
      });
    }
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
    this.toggleCommentMenuFlag.set(false);
    this.currentCommentId.set(commentId);
    this.toggleCommentMenuFlag.update((state) => !state);
  }

  deletePost(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      // this.udatePosts.emit(true);
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
  ////////////////////////////////////////////////////
  showEditCommentPopup = signal(false);

  editCommentText = signal('');
  editCommentImage = signal<File | null>(null);
  editCommentImagePreview = signal<string | null>(null);

  isUpdatingComment = signal(false);

  private previewObjectUrl: string | null = null;

  openEditCommentPopup(comment: { content: string; image?: string | null }): void {
    this.resetEditCommentPopup();

    this.editCommentText.set(comment.content);
    this.editCommentImagePreview.set(comment.image ?? null);

    this.showEditCommentPopup.set(true);
  }

  onEditCommentImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    this.clearPreviewObjectUrl();

    this.editCommentImage.set(file);

    this.previewObjectUrl = URL.createObjectURL(file);
    this.editCommentImagePreview.set(this.previewObjectUrl);
  }

  removeEditCommentImage(): void {
    this.editCommentImage.set(null);
    this.clearPreviewObjectUrl();
    this.editCommentImagePreview.set(null);
  }

  closeEditCommentPopup(): void {
    this.showEditCommentPopup.set(false);
    this.resetEditCommentPopup();
  }

  private resetEditCommentPopup(): void {
    this.editCommentText.set('');
    this.editCommentImage.set(null);
    this.editCommentImagePreview.set(null);

    this.clearPreviewObjectUrl();

    // Reset the native file input too, if you use a ViewChild for it.
  }

  private clearPreviewObjectUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
  }
}
