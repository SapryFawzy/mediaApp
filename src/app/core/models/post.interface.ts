export interface Post {
  _id: string;
  body?: string;
  image?: string;
  privacy: string;
  user: User;
  sharedPost: ISharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: topComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

interface ISharedPost {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: string[];
  createdAt: string;
  image: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface topComment {
  _id: string;
  content: string;
  image: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
