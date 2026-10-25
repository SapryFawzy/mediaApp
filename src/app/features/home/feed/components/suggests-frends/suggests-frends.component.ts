import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommuntyService } from '../../../../../core/Service/main/communty.service';
import { ISuggestedFrinds } from '../../../../../core/models/isuggested-frinds.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suggests-frends',
  imports: [RouterLink],
  templateUrl: './suggests-frends.component.html',
  styleUrl: './suggests-frends.component.css',
})
export class SuggestsFrendsComponent implements OnInit {
  private readonly communtyService = inject(CommuntyService);
  suggestedFrinds: WritableSignal<ISuggestedFrinds[]> = signal([]);

  ngOnInit(): void {
    this.getSuggestedFrinds();
  }

  getSuggestedFrinds() {
    this.communtyService.getSuggestedFrinds().subscribe((res: any) => {
      this.suggestedFrinds.set(res.data.suggestions);
    });
  }
}
