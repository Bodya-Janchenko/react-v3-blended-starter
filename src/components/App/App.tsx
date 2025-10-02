import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

import css from "./App.module.css";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import type { Post } from "../../types/post";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, currentPage],
    queryFn: () => fetchPosts(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openCreateModal = () => {
    setIsModalOpen(true);
    setIsCreatePost(true);
    setIsEditPost(false);
    setEditedPost(null);
  };

  const openEditModal = (post: Post) => {
    setIsModalOpen(true);
    setIsEditPost(true);
    setIsCreatePost(false);
    setEditedPost(post);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditedPost(null);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setSearchQuery={setSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openCreateModal}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {isCreatePost && <CreatePostForm onClose={closeModal} />}
          {isEditPost && editedPost && <EditPostForm post={editedPost} onClose={closeModal} />}
        </Modal>
      )}
      {posts && <PostList posts={posts} onEdit={openEditModal} />}
    </div>
  );
}
