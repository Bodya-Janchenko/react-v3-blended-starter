import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";

interface PostForm {
  onClose: () => void;
}

const PostForm = ({ onClose }: PostForm) => {
  const fieldId = useId();

  interface OrderValues {
    title: string;
    body: string;
  }

  const OrderValues: OrderValues = {
    title: "",
    body: "",
  };

  const OrderValuesSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(500, "Title is too long")
      .required(),
    body: Yup.string().max(500, "Content is too long").required(),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: OrderValues) => createPost(newPost),
    onSuccess: () => {
      toast.success("Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (error) => {
      toast.error("Oops, something went wrong while creating the post.");
      console.log(`Something went wrong while creating the post: ${error}`);
    },
  });

  const handleSubmit = (newNote: OrderValues, actions: FormikHelpers<OrderValues>) => {
    mutation.mutate(newNote);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={OrderValues}
      onSubmit={handleSubmit}
      validationSchema={OrderValuesSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-body`}>Content</label>
          <Field
            id={`${fieldId}-body`}
            as="textarea"
            name="body"
            rows="8"
            className={css.textarea}
          />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default PostForm;
