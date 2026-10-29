import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../../../../../core/Service/main/posts.service';
import { Icomment } from '../../../../../../../core/models/icomment.interface';
import { IUserProfile } from '../../../../../../../core/models/iuser-profile.interface';
import { UserService } from '../../../../../../../core/Service/user/user.service';
import { FormatDatePipe } from '../../../../../../../shared/pipes/format-date-pipe';
import { FormErrorMsgComponent } from '../../../../../../../shared/ui/auth/form-error-msg/form-error-msg.component';

@Component({
  selector: 'app-comments',
  standalone: true,
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
  noCommenting = signal(false);

  contant = new FormControl('', [Validators.minLength(2)]);
  newContant = new FormControl('', [Validators.minLength(2)]);
  replaycontant = new FormControl('', [Validators.minLength(2)]);

  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  editeImgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  repalyImgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);

  selectedImage: File | null = null;
  repalySelectedImage: File | null = null;
  removeOriginalEditImage = signal(false);

  showEmojiPicker = signal(false);
  showrepalyEmojiPicker = signal(false);
  commentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('bindTextarea');
  repaycommentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('replaybindTextarea');

  showPostEditor = signal(false);
  showEditCommentPopup = signal(false);
  toggleCommentMenuFlag = signal(false); // kept for compatibility with any existing template bindings
  currentCommentId: WritableSignal<string> = signal('');
  activeCommentMenu = signal<string | null>(null);

  showCreateCommentError = signal(false);
  showCreateReplayCommentError = signal(false);
  showUpdateCommentError = signal(false);
  replays: WritableSignal<Icomment[]> = signal([]);
  showReplays = signal(false);

  emojis: string[] = [
    '😀', '😂', '😍', '🥰', '😎', '🤩', '😊', '😉', '😭', '😡',
    '🤔', '😴', '🥳', '🤗', '😇', '❤️', '🧡', '💛', '💚', '💙',
    '💜', '🖤', '🤍', '🔥', '✨', '🎉', '💯', '👏', '🙌', '👍',
    '👎', '💪', '🙏', '💖', '💕', '💔', '🌹', '⭐', '🚀',
  ];

  ngOnInit(): void {
    this.getPostComment();
  }

  getPostComment(): void {
    this.postsService.getPostComment(this.postId()).subscribe({
      next: (res: any) => this.comments.set(res.data.comments ?? []),
      error: (error) => console.error('Failed to load comments:', error),
    });
  }

  getCommentsReplays(commentId: string): void {
    if (this.showReplays()) {
      this.showReplays.set(false);
      return;
    }

    this.showReplays.set(true);
    this.postsService.getCommentReplays(this.postId(), commentId).subscribe({
      next: (res: any) => this.replays.set(res.data.replies ?? []),
      error: (error) => console.error('Failed to load replies:', error),
    });
  }

  toggleCommentMenu(commentId: string): void {
    this.currentCommentId.set(commentId);
    this.activeCommentMenu.update((currentId) => currentId === commentId ? null : commentId);
    this.toggleCommentMenuFlag.set(this.activeCommentMenu() !== null);
  }

  closeCommentMenu(): void {
    this.activeCommentMenu.set(null);
    this.toggleCommentMenuFlag.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (!target.closest('[data-comment-menu-root="true"]')) {
      this.closeCommentMenu();
    }

    if (!target.closest('[data-comment-mention-root="true"]')) {
      this.showEmojiPicker.set(false);
      this.showrepalyEmojiPicker.set(false);
    }
  }

  openEditCommentPopup(commentId: string, content = '', image: string | null | undefined = null): void {
    this.closeCommentMenu();
    this.currentCommentId.set(commentId);
    this.newContant.setValue(content ?? '');
    this.newContant.markAsPristine();
    this.newContant.markAsUntouched();
    this.selectedImage = null;
    this.editeImgToDisplay.set(image);
    this.removeOriginalEditImage.set(false);
    this.showUpdateCommentError.set(false);
    this.showEditCommentPopup.set(true);
  }

  closeEditCommentPopup(): void {
    this.showEditCommentPopup.set(false);
    this.newContant.reset('');
    this.selectedImage = null;
    this.editeImgToDisplay.set(null);
    this.removeOriginalEditImage.set(false);
    this.showUpdateCommentError.set(false);
  }

  toggleEditCommentPopup(content = '', image: string | null = null): void {
    // Compatibility helper for older template calls. Prefer openEditCommentPopup().
    if (this.showEditCommentPopup()) {
      this.closeEditCommentPopup();
    } else {
      this.openEditCommentPopup(this.currentCommentId(), content, image);
    }
  }

  updateComment(): void {
    const content = String(this.newContant.value ?? '').trim();
    const hasNewImage = !!this.selectedImage;
    const hasExistingImage = !!this.editeImgToDisplay() && !this.removeOriginalEditImage();

    this.showUpdateCommentError.set(false);
    if (content.length > 0 && this.newContant.invalid) {
      this.showUpdateCommentError.set(true);
      return;
    }
    if (!content && !hasNewImage && !hasExistingImage) {
      this.showUpdateCommentError.set(true);
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    } else if (this.removeOriginalEditImage()) {
      // The API needs to accept an empty image field for removal of an existing image.
      formData.append('image', '');
    }

    this.postsService.upDateComment(this.postId(), this.currentCommentId(), formData).subscribe({
      next: () => {
        this.closeEditCommentPopup();
        this.getPostComment();
        if (this.showReplays()) {
          this.postsService.getCommentReplays(this.postId(), this.currentCommentId()).subscribe({
            next: (res: any) => this.replays.set(res.data.replies ?? []),
            error: () => undefined,
          });
        }
      },
      error: (error) => {
        console.error('Failed to update comment:', error);
        this.showUpdateCommentError.set(true);
      },
    });
  }

  deleteComment(commentId: string): void {
    this.closeCommentMenu();
    this.postsService.deleteComment(this.postId(), commentId).subscribe({
      next: () => {
        this.getPostComment();
        this.replays.update((items) => items.filter((item) => item._id !== commentId));
      },
      error: (error) => console.error('Failed to delete comment:', error),
    });
  }

  likeAndUnlikeComment(commentId: string): void {
    this.postsService.likeAndUlikeComment(this.postId(), commentId).subscribe({
      next: () => this.getPostComment(),
      error: (error) => console.error('Failed to like comment:', error),
    });
  }

  toggleEmojiPicker(place = ''): void {
    if (place === 'replay') {
      this.showrepalyEmojiPicker.update((state) => !state);
      this.showEmojiPicker.set(false);
    } else {
      this.showEmojiPicker.update((state) => !state);
      this.showrepalyEmojiPicker.set(false);
    }
  }

  insertEmoji(emoji: string, place = ''): void {
    const textarea = place === 'replay'
      ? this.repaycommentTextarea()?.nativeElement
      : this.commentTextarea()?.nativeElement;
    if (!textarea) return;

    const control = place === 'replay' ? this.replaycontant : this.contant;
    const value = String(control.value ?? '');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = value.slice(0, start) + emoji + value.slice(end);

    control.setValue(nextValue);
    if (place === 'replay') this.showrepalyEmojiPicker.set(false);
    else this.showEmojiPicker.set(false);

    textarea.focus();
    const cursor = start + emoji.length;
    textarea.setSelectionRange(cursor, cursor);
  }

  onFileSelected(event: Event, place = ''): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (this.showEditCommentPopup()) {
      this.selectedImage = file;
      this.removeOriginalEditImage.set(false);
      const reader = new FileReader();
      reader.onload = () => this.editeImgToDisplay.set(reader.result);
      reader.readAsDataURL(file);
    } else if (place === 'replay') {
      this.repalySelectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.repalyImgToDisplay.set(reader.result);
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.imgToDisplay.set(reader.result);
      reader.readAsDataURL(file);
    }
    target.value = '';
  }

  onFileSelectedInEdit(event: Event): void {
    this.onFileSelected(event);
  }

  cancelImg(): void {
    if (this.showEditCommentPopup()) {
      this.editeImgToDisplay.set(null);
      this.selectedImage = null;
      this.removeOriginalEditImage.set(true);
      return;
    }

    this.imgToDisplay.set(null);
    this.selectedImage = null;
    this.repalyImgToDisplay.set(null);
    this.repalySelectedImage = null;
  }

  createComment(event: SubmitEvent, form: HTMLFormElement): void {
    event.preventDefault();
    this.showCreateCommentError.set(false);

    const content = String(this.contant.value ?? '').trim();
    if (content && this.contant.invalid) {
      this.showCreateCommentError.set(true);
      return;
    }
    if (!content && !this.selectedImage) {
      this.showCreateCommentError.set(true);
      return;
    }

    const formData = new FormData();
    if (content) formData.append('content', content);
    if (this.selectedImage) formData.append('image', this.selectedImage);

    this.postsService.createCommentOnPost(this.postId(), formData).subscribe({
      next: () => {
        this.getPostComment();
        this.contant.reset('');
        form.reset();
        this.imgToDisplay.set(null);
        this.selectedImage = null;
      },
      error: (error) => console.error('Failed to create comment:', error),
    });
  }

  createReplay(event: SubmitEvent, form: HTMLFormElement, commentId: string): void {
    event.preventDefault();
    this.showCreateReplayCommentError.set(false);

    const content = String(this.replaycontant.value ?? '').trim();
    if (content && this.replaycontant.invalid) {
      this.showCreateReplayCommentError.set(true);
      return;
    }
    if (!content && !this.repalySelectedImage) {
      this.showCreateReplayCommentError.set(true);
      return;
    }

    const formData = new FormData();
    if (content) formData.append('content', content);
    if (this.repalySelectedImage) formData.append('image', this.repalySelectedImage);

    this.postsService.createCommentReplays(this.postId(), commentId, formData).subscribe({
      next: () => {
        this.replaycontant.reset('');
        form.reset();
        this.repalyImgToDisplay.set(null);
        this.repalySelectedImage = null;
        this.postsService.getCommentReplays(this.postId(), commentId).subscribe({
          next: (res: any) => this.replays.set(res.data.replies ?? []),
          error: (error) => console.error('Failed to refresh replies:', error),
        });
        this.getPostComment();
      },
      error: (error) => console.error('Failed to create reply:', error),
    });
  }

  deletePost(id: string): void {
    this.postsService.deletePost(id).subscribe({
      error: (error) => console.error('Failed to delete post:', error),
    });
  }

  editPost(id: string, form: HTMLFormElement, event: SubmitEvent): void {
    event.preventDefault();
    const formData = new FormData();
    if (this.selectedImage) formData.append('image', this.selectedImage);
    formData.append('body', String(this.contant.value ?? ''));

    this.postsService.editePost(id, formData).subscribe({
      next: () => {
        form.reset();
        this.closeCommentEditor();
      },
      error: (error) => console.error('Failed to edit post:', error),
    });
  }

  closeCommentEditorOnTouch(event: Event): void {
    if (event.target === event.currentTarget) this.closeCommentEditor();
  }

  closeCommentEditor(): void {
    this.showPostEditor.set(false);
    this.imgToDisplay.set(null);
    this.selectedImage = null;
    this.contant.reset('');
  }
}
