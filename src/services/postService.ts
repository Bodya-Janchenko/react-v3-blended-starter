import axios from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
const PER_PAGE: number = 8;

interface fetchPostsResponse {
  posts: Post[];
  totalPages: number;
}

export const fetchPosts = async (searchText: string, page: number): Promise<fetchPostsResponse> => {
  const options = {
    params: {
      q: searchText,
      _page: page,
      _limit: PER_PAGE,
    },
  };
  const response = await axios.get<Post[]>("/posts", options);
  const totalCount = Number(response.headers["x-total-count"]);

  return {
    posts: response.data,
    totalPages: Math.ceil(totalCount / PER_PAGE),
  };
};

interface CreatePostProps {
  title: string;
  body: string;
}

export const createPost = async (newPost: CreatePostProps): Promise<Post> => {
  const response = await axios.post<Post>("/posts", newPost);
  return response.data;
};

export interface editPostPromise {
  postId: number;
  newDataPost: {
    userId?: number;
    title?: string;
    body?: string;
  };
}

export const editPost = async ({ postId, newDataPost }: editPostPromise): Promise<Post> => {
  const response = await axios.patch<Post>(`/posts/${postId}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number): Promise<Post> => {
  const response = await axios.delete<Post>(`/posts/${postId}`);
  return response.data;
};
