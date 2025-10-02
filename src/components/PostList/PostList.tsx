import css from "./PostList.module.css";
import { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/postService";
import toast from "react-hot-toast";

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
}

const PostList = ({ posts, onEdit }: PostListProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post delete!");
    },
    onError: (error) => {
      toast.error("Oops, something went wrong while deleting the note.");
      console.log(`Something went wrong while deleting the note: ${error}`);
    },
  });

  const handleDelete = (postId: number) => {
    mutation.mutate(postId);
  };

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => onEdit(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => handleDelete(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
