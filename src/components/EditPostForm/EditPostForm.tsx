import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { useId } from "react";
import { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost, editPostPromise } from "../../services/postService";
import toast from "react-hot-toast";

interface EditPostFormProps {
  post: Post;
  onClose: () => void;
}

const EditPostForm = ({ post, onClose }: EditPostFormProps) => {
  const fieldId = useId();

  interface EditFormValues {
    title: string;
    body: string;
  }

  const initialValues: EditFormValues = {
    title: post.title ?? "",
    body: post.body ?? "",
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newDataPost: editPostPromise) => editPost(newDataPost),
    onSuccess: () => {
      toast.success("Note edited!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error("Oops, something went wrong while editing the note.");
      console.log(`Something went wrong while creating the note: ${error}`);
    },
  });

  const handleSubmit = (values: EditFormValues, actions: FormikHelpers<EditFormValues>) => {
    mutation.mutate({
      postId: post.id,
      newDataPost: {
        title: values.title,
        body: values.body,
      },
    });
    actions.resetForm();
    onClose();
  };

  const OrderValuesSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(500, "Title is too long")
      .required(),
    body: Yup.string().max(500, "Content is too long").required(),
  });

  return (
    <Formik
      initialValues={initialValues}
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
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EditPostForm;
