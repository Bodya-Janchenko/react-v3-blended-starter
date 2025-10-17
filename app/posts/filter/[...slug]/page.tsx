import { fetchPosts } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostsClient from './Posts.client';

interface PostsPageProps {
  params: { slug: string[] };
}

const PostsPage = async ({ params }: PostsPageProps) => {
  const { slug } = params;
  const userId = slug?.[0]?.toLowerCase() === 'all' ? undefined : slug?.[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', '', 1, userId],
    queryFn: () =>
      fetchPosts({
        searchText: '',
        page: 1,
        userId,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient userId={userId} />
    </HydrationBoundary>
  );
};

export default PostsPage;

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const resolvedParams = params;
  const slug = resolvedParams.slug;
  const userId = slug?.[0]?.toLowerCase() === 'all' ? undefined : slug[0];

  return {
    title: !userId ? 'Posts - All Users' : `Posts - User ${userId}`,
    description: `View posts by ${userId ?? 'all users'}`,
  };
}
