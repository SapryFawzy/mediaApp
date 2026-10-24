import { Component, signal, WritableSignal } from '@angular/core';
import { PostsComponent } from './components/posts/posts.component';
import { SuggestsFrendsComponent } from './components/suggests-frends/suggests-frends.component';

@Component({
  selector: 'app-feed',
  imports: [PostsComponent, SuggestsFrendsComponent],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  postsType: WritableSignal<string> = signal('feed');

  swapPosts(type: string): void {
    this.postsType.set(type);
  }
}
