import { useState } from "react";

import { authApi } from "../../lib/authapi";
import { api } from "../../lib/api";


export function useCategoryForm(
  refresh
) {
  const [form, setForm] = useState({
    name: "",

    thumbnail: null,

    seo: {
      meta_title: "",

      meta_description: "",

      keywords: [],
    },
  });

  const [loading, setLoading] =
    useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  async function saveCategory({
    closeModal,
    setError,
  }) {
    setError("");
    setLoading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "category_picture",
        form.thumbnail
      );

      formData.append(
        "seo",
        JSON.stringify({
          meta_title:
            form.seo.meta_title,

          meta_description:
            form.seo
              .meta_description,

          keywords:
            form.seo.keywords,
        })
      );

      await authApi.createCategory(
        formData
      );

      await refresh();

      closeModal();

    } catch (err) {

      setError(
        err?.message ||
        "Save failed"
      );

    } finally {

      setLoading(false);
    }
  }
  async function uploadCategoryImage({
    file,

    setError,

    setForm,
  }) {
    setError("");

    setUploadingImage(true);

    try {
      const { url } =
        await api.uploadCategoryImage(
          file
        );

      setForm((prev) => ({
        ...prev,

        thumbnail: url || "",
      }));
    } catch (err) {
      setError(
        err?.message ||
        "Image upload failed"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  return {
    form,
    setForm,

    loading,

    uploadingImage,

    saveCategory,

    uploadCategoryImage,
  };
}