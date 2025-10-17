'use client';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

const PostDetailsClient = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchPostById(id),
    refetchOnMount: false,
  });

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!data?.userId) return;

      try {
        const fetchedUser = await fetchUserById(data.userId);
        setUser(fetchedUser.name);
      } catch {
        setUser('Unknown author');
      }
    };

    loadUser();
  }, [data?.userId]);

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error && isError) return <p>Something went wrong.</p>;

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <button className={css.backBtn} onClick={handleGoBack}>
              ← Back
            </button>

            <div className={css.post}>
              <div className={css.wrapper}>
                <div className={css.header}>
                  <h2>{data?.title}</h2>
                </div>

                <p className={css.content}>{data?.body}</p>
              </div>
              <p className={css.user}>Author: {user}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostDetailsClient;
