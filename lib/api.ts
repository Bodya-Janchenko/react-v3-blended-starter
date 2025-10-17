import axios from 'axios';
import type { Post } from '@/types/post';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

export type FetchPostsResponse = Post[];

export const fetchPosts = async ({
  searchText,
  page,
  userId,
}: {
  searchText: string;
  page: number;
  userId?: string;
}): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await axios.get<FetchPostsResponse>('/posts', {
    params: {
      userId,
      ...(searchText !== '' && { q: searchText }),
      _page: page,
      _limit: 8,
    },
  });
  const totalCount = Number(response.headers['x-total-count']);
  return { posts: response.data, totalCount };
};

interface NewPostContent {
  title: string;
  body: string;
}

interface EditedPost {
  id: number;
  title: string;
  body: string;
}

export const createPost = async (newPost: NewPostContent) => {
  const response = await axios.post<Post>('/posts', newPost);
  return response.data;
};

export const editPost = async (newDataPost: EditedPost) => {
  const response = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await axios.delete<Post>(`/posts/${postId}`);
  return response.data;
};

export const fetchPostById = async (postId: string): Promise<Post> => {
  const response = await axios.get<Post>(`/posts/${postId}`);
  return response.data;
};

interface FetchUsersResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const fetchUsers = async (): Promise<FetchUsersResponse[]> => {
  const response = await axios.get<FetchUsersResponse[]>('/users');
  return response.data;
};

export const fetchUserById = async (userId: number): Promise<FetchUsersResponse> => {
  const response = await axios.get<FetchUsersResponse>(`/users/${userId}`);
  return response.data;
};
