import { useState } from "react";

import CategoryTable from "../components/categories/CategoryTable";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import CategoryViewModal from "../components/categories/CategoryViewModal";

import { useCategories } from "../components/hooks/useCategories";
import { useCategoryForm } from "../components/hooks/useCategoryForm";

export default function Categories() {

  const [modal, setModal] =
    useState(null);

  const {
    items,
    listLoading,
    error,
    setError,
    refresh,
    deleteCategory,
  } = useCategories();

  const {
    form,
    setForm,
    loading,
    uploadingImage,
    saveCategory,
    uploadCategoryImage,
  } = useCategoryForm(refresh);

  function openAdd() {
    setError("");
    setForm({
      name: "",
      thumbnail: "",
      seo: {
        meta_title: "",
        meta_description: "",
        keywords: [],
      },
    });

    setModal({
      mode: "add",
    });
  }

  function openView(cat) {
    setError("");

    setModal({
      mode: "view",
      category: cat,
    });
  }


  function closeModal() {
    setModal(null);

    setForm({
      name: "",

      thumbnail: "",

      seo: {
        meta_title: "",

        meta_description: "",

        keywords: [],
      },
    });
  }

  async function onSave(e) {
    e.preventDefault();

    await saveCategory({
      closeModal,

      setError,
    });
  }

  async function onImageFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    await uploadCategoryImage({
      file,
      setError,
      setForm,
    });

    e.target.value = "";
  }

  function clearCategoryImage() {
    setForm((prev) => ({
      ...prev,

      thumbnail: "",
    }));
  }

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <div>
          <h1 className="adminPageTitle">
            Categories
          </h1>

          <div className="muted">
            Master list for products.
          </div>
        </div>
      </div>

      <div
        className="adminTableWrap"
        style={{ marginTop: 14 }}
      >
        <div className="adminTableTop">
          <div className="adminTableTitle">
            Category listing
          </div>

          <button
            className="adminBtn adminBtnPrimary"
            type="button"
            onClick={openAdd}
          >
            + Add Category
          </button>
        </div>

        <CategoryTable
          items={items}
          listLoading={listLoading}
          onView={openView}
        />
      </div>

      {error ? (
        <div className="error">
          {error}
        </div>
      ) : null}

      {modal?.mode === "view" ? (
        <CategoryViewModal
          category={modal.category}
          onClose={closeModal}
        />
      ) : null}

      {modal?.mode === "add" && (
        <CategoryFormModal
          modal={modal}
          form={form}
          setForm={setForm}
          loading={loading}
          uploadingImage={
            uploadingImage
          }
          onSave={onSave}
          onClose={closeModal}
          onImageFileChange={
            onImageFileChange
          }
          clearCategoryImage={
            clearCategoryImage
          }
        />
      )}
    </div>
  );
}