import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getPosts(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + 'posts');
  }

  getSinglePost(postId: string): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `posts/${postId}`);
  }

  createPost(body: FormData): Observable<object> {
    return this.httpClient.post(environment.BASE_URL + `posts`, body);
  }

  savePost(postId: string): Observable<object> {
    return this.httpClient.put(environment.BASE_URL + `posts/${postId}/bookmark`, null);
  }

  editePost(postId: string, body: FormData): Observable<object> {
    return this.httpClient.put(environment.BASE_URL + `posts/${postId}`, body);
  }

  deletePost(postId: string): Observable<object> {
    return this.httpClient.delete(environment.BASE_URL + `posts/${postId}`);
  }

  getSavedPosts(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/bookmarks`);
  }

  getUserPosts(): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `posts/feed?only=me&limit=20&page=1`);
  }

  likeAndUlikePost(postId: string) {
    return this.httpClient.put(environment.BASE_URL + `posts/${postId}/like`, {});
  }

  sharePost(postId: string, body: FormData) {
    return this.httpClient.post(environment.BASE_URL + `posts/${postId}/share`, body);
  }

  getPostComment(postId: string): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `posts/${postId}/comments?page=1&limit=10`);
  }

  createCommentOnPost(postId: string, body: FormData): Observable<object> {
    return this.httpClient.post(environment.BASE_URL + `posts/${postId}/comments`, body);
  }

  getCommentReplays(postId: string, commentId: string) {
    return this.httpClient.get(
      environment.BASE_URL + `posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
    );
  }

  createCommentReplays(postId: string, commentId: string, body: FormData) {
    return this.httpClient.post(
      environment.BASE_URL + `posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
      body,
    );
  }

  upDateComment(postId: string, commentId: string, body: FormData) {
    return this.httpClient.put(
      environment.BASE_URL + `posts/${postId}/comments/${commentId}`,
      body,
    );
  }

  deleteComment(postId: string, commentId: string) {
    return this.httpClient.delete(environment.BASE_URL + `posts/${postId}/comments/${commentId}`);
  }

  likeAndUlikeComment(postId: string, commentId: string) {
    return this.httpClient.put(
      environment.BASE_URL + `posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }

  getAllUserPosts(id: string): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `users/${id}/posts`);
  }

  getAllPostLikes(id: string, limit: number): Observable<object> {
    return this.httpClient.get(environment.BASE_URL + `posts/${id}/likes?page=1&limit=${limit}`);
  }

  getFeedPosts() {
    return this.httpClient.get(environment.BASE_URL + `posts/feed?only=following&limit=20&page=1`);
  }
}
