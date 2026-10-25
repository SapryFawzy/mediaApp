import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommuntyService } from '../../../../../core/Service/main/communty.service';
import { ISuggestedFrinds } from '../../../../../core/models/isuggested-frinds.interface';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../../core/Service/user/user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-suggests-frends',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './suggests-frends.component.html',
  styleUrl: './suggests-frends.component.css',
})
export class SuggestsFrendsComponent implements OnInit {
  private readonly communtyService = inject(CommuntyService);
  private readonly userService = inject(UserService);
  suggestedFrinds: WritableSignal<ISuggestedFrinds[]> = signal([]);
  toggleSuggestedFrinds: WritableSignal<boolean> = signal(false);
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

  toggleSuggestedFrindsList() {
    this.toggleSuggestedFrinds.update((state) => !state);
  }

  getSuggestedFrinds() {
    this.communtyService.getSuggestedFrinds().subscribe((res: any) => {
      this.suggestedFrinds.set(res.data.suggestions);
    });
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
