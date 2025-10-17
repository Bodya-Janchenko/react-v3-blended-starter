import { fetchPostById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostDetailsClient from './PostDetails.client';

interface PostDetailsProps {
  params: Promise<{ id: string }>;
}

const PostDetails = async ({ params }: PostDetailsProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient />
    </HydrationBoundary>
  );
};

export default PostDetails;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await fetchPostById(id);

  return {
    title: post.title,
    description: post.body.slice(0, 30) + '...',
  };
}
