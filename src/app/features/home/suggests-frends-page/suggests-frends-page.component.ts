import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ISuggestedFrinds } from '../../../core/models/isuggested-frinds.interface';
import { CommuntyService } from '../../../core/Service/main/communty.service';
import { UserService } from '../../../core/Service/user/user.service';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-suggests-frends-page',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './suggests-frends-page.component.html',
  styleUrl: './suggests-frends-page.component.css',
})
export class SuggestsFrendsPageComponent implements OnInit {
  private readonly communtyService = inject(CommuntyService);
  private readonly location = inject(Location);
  private readonly userService = inject(UserService);
  suggestedFrinds: WritableSignal<ISuggestedFrinds[]> = signal([]);
  limit: WritableSignal<number> = signal(20);
  searchValue: FormControl = new FormControl('');
  private timeOutID: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.getSuggestedFrinds();
  }

  followAndUnFollow(id: string) {
    this.userService.followAndUnFollow(id).subscribe(() => {
      this.getSuggestedFrinds();
    });
  }

  getSuggestedFrinds() {
    this.communtyService.getSuggestedFrinds(this.limit()).subscribe((res: any) => {
      this.suggestedFrinds.set(res.data.suggestions);
    });
  }

  goBack() {
    this.location.back();
  }

  loadMore() {
    this.limit.update((num) => num + 20);
    this.getSuggestedFrinds();
  }

  searchUsers() {
    clearTimeout(this.timeOutID);
    this.timeOutID = setTimeout(() => {
      console.log(this.searchValue.value);

      if (this.searchValue.value) {
        this.communtyService.searchForFriend(this.searchValue.value).subscribe((res: any) => {
          this.suggestedFrinds.set(res.data.users);
        });
        console.log(this.suggestedFrinds());
      } else {
        this.getSuggestedFrinds();
      }
    }, 1000);
  }
}
