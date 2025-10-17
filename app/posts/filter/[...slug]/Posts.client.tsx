'use client';

import css from './page.module.css';

import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { Post } from '@/types/post';
import { fetchPosts } from '@/lib/api';

import toast, { Toaster } from 'react-hot-toast';
import PostList from '@/components/PostList/PostList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import EditPostForm from '@/components/EditPostForm/EditPostForm';
import CreatePostForm from '@/components/CreatePostForm/CreatePostForm';

interface PostsClientProps {
  userId: string | undefined;
}

export default function PostsClient({ userId }: PostsClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const [debounceSearchQuery] = useDebounce(searchQuery, 300);

  const { data, isError, error } = useQuery({
    queryKey: ['posts', debounceSearchQuery, currentPage, userId],
    queryFn: () =>
      fetchPosts({
        searchText: debounceSearchQuery,
        page: currentPage,
        ...(userId !== 'All' && { userId }),
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops, something went wrong while get the posts.`);
      console.log(`Something went wrong while get the posts: ${error}`);
    }
  }, [isError, error]);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const toggleEditPost = (post: Post) => {
    setEditedPost(post);
    setIsModalOpen(true);
  };

  const changeSearchQuery = useDebouncedCallback((newQuery: string) => {
    setCurrentPage(1);
    setSearchQuery(newQuery);
  }, 300);

  const totalPages = Math.ceil((data?.totalCount ?? 0) / 8);
  const posts = data?.posts ?? [];

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <main className={css.main}>
        <section className={css.postsSection}>
          <header className={css.toolbar}>
            <SearchBox onSearch={changeSearchQuery} />
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}

            <button
              className={css.button}
              onClick={() => {
                toggleModal();
              }}
            >
              Create post +
            </button>
          </header>
          {isModalOpen && (
            <Modal onClose={toggleModal}>
              {editedPost ? (
                <EditPostForm
                  initialValues={editedPost}
                  onClose={() => {
                    toggleModal();
                    setEditedPost(null);
                  }}
                />
              ) : (
                <CreatePostForm onClose={toggleModal} />
              )}
            </Modal>
          )}
          {posts.length > 0 && (
            <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
          )}
        </section>
      </main>
    </div>
  );
}
