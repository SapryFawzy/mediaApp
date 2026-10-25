import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../../core/Service/user/user.service';
import { IUserProfile } from '../../../core/models/iuser-profile.interface';
import { PostsService } from '../../../core/Service/main/posts.service';
import { Post } from '../../../core/models/post.interface';
import { PostComponent } from '../feed/components/posts/component/post/post.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

type fileDisplayer = string | ArrayBuffer | null | undefined;

@Component({
  selector: 'app-profile',
  imports: [PostComponent, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);
  userProfileData: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  userposts: WritableSignal<Post[]> = signal([]);
  postCatagory: WritableSignal<string> = signal('userPosts');
  savedPosts: WritableSignal<Post[]> = signal([]);
  selectedCoverImage!: File | null;
  selectedAvatarImage!: File | null;
  displayAvatarImage: WritableSignal<fileDisplayer> = signal('');
  privacy: FormControl = new FormControl('public');
  showImgeDisplayer: WritableSignal<boolean> = signal(false);
  currntImage: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getUserProfileData();
    this.getUserPosts();
    this.getSavedPosts();
  }

  getUserPosts() {
    this.postsService.getUserPosts().subscribe((res: any) => {
      this.userposts.set(res.data.posts);
    });
  }

  getSavedPosts() {
    this.postsService.getSavedPosts().subscribe((res: any) => {
      this.savedPosts.set(res.data.bookmarks);
    });
  }

  getUserProfileData() {
    this.userService.getUserProfileData().subscribe((res: any) => {
      this.userProfileData.set(res.data.user);
    });
  }

  selectImg(e: Event): File | null {
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length) {
        return target.files[0];
      }
    }
    return null;
  }

  showImage(img: File, dispayer: WritableSignal<fileDisplayer>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(img);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      dispayer.set(e.target?.result);
    };
  }

  closeAvatarImage(): void {
    this.displayAvatarImage.set('');
    this.selectedAvatarImage = null;
  }

  closeAvatarImagePopup(e: Event): void {
    e?.stopPropagation();
    const ele = e.target as HTMLDivElement;
    if (!ele) return;
    const eleId = ele.id;
    if (eleId !== 'model') return;
    this.closeAvatarImage();
  }

  updateAvatar(e: Event) {
    e.preventDefault();
    const formData = new FormData();
    if (this.selectedAvatarImage) {
      formData.append('photo', this.selectedAvatarImage);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }
    this.userService.uploadUserPhoto(formData).subscribe(() => {
      this.getUserProfileData();
      this.userService.updateUserData();
      this.getUserPosts();
      this.getSavedPosts();
    });
    this.closeAvatarImage();
  }

  selectAvatarImage(e: Event) {
    this.selectedAvatarImage = this.selectImg(e);
    if (this.selectedAvatarImage) {
      this.showImage(this.selectedAvatarImage, this.displayAvatarImage);
    }
  }

  updateUserCoverImage(e: Event) {
    e.preventDefault();
    const formData = new FormData();

    console.log(this.selectedCoverImage);

    if (this.selectedCoverImage) {
      formData.append('cover', this.selectedCoverImage);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }
    this.userService.uploadUserCoverImage(formData).subscribe(() => {
      this.getUserProfileData();
      this.getUserPosts();
    });

    this.closeCoverImage();
  }

  closeCoverImage(): void {
    this.selectedCoverImage = null;
  }

  closeCoverImagePopup(e: Event): void {
    e?.stopPropagation();
    const ele = e.target as HTMLDivElement;
    if (!ele) return;
    const eleId = ele.id;
    if (eleId !== 'model') return;
    this.closeAvatarImage();
  }

  selectCoverImage(e: Event) {
    this.selectedCoverImage = this.selectImg(e);
  }

  removeCoverImage() {
    this.userService.deleteCoverImage().subscribe(() => {
      this.getUserProfileData();
    });
  }

  closePreviewImage(e: Event): void {
    e?.stopPropagation();
    const ele = e.target as HTMLDivElement;
    if (!ele) return;
    const eleId = ele.id;
    if (eleId !== 'model') return;
    this.closeImgDisplayer();
  }

  closeImgDisplayer(): void {
    this.showImgeDisplayer.set(false);
  }
}
