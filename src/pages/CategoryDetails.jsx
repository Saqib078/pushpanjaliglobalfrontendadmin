import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { authApi } from "../lib/authapi";

export default function CategoryDetails() {

    const navigate =
        useNavigate();

    const { slug } =
        useParams();

    const [loading, setLoading] =
        useState(true);

    const [
        updateLoading,
        setUpdateLoading,
    ] = useState(false);

    const [category, setCategory] =
        useState(null);

    const [
        basicEdit,
        setBasicEdit,
    ] = useState(false);

    const [seoEdit, setSeoEdit] =
        useState(false);

    const [keywordInput, setKeywordInput] =
        useState("");

    const [
        thumbnailFile,
        setThumbnailFile,
    ] = useState(null);

    async function loadCategory() {

        try {

            setLoading(true);
            const data = await authApi.getCategoryBySlug(slug);
            if (data.success) {
                setCategory(data.data);
                setKeywordInput(
                    Array.isArray(
                        data.data?.seo?.keywords
                    )
                        ? data.data.seo.keywords.join(
                            ", "
                        )
                        : ""
                );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (slug) {
            loadCategory();
        }
    }, [slug]);

    async function updateBasicInfo() {
        try {
            setUpdateLoading(true);
            const formData = new FormData();
            if (category.name) {
                formData.append("name", category.name);
            }

            if (category.slug) {
                formData.append("slug", category.slug);
            }

            if (thumbnailFile) {
                formData.append("category_picture", thumbnailFile);
            }

            const response = await authApi.updateCategory(slug, formData);

            if (response.success) {
                setCategory(response.data);
                setBasicEdit(false);
                setThumbnailFile(null);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUpdateLoading(false);
        }
    }

    async function updateSeo() {
        try {
            setUpdateLoading(true);
            const formData = new FormData();
            formData.append("seo", JSON.stringify({
                meta_title:
                    category?.seo
                        ?.meta_title || "",
                meta_description:
                    category?.seo
                        ?.meta_description || "",
                keywords:
                    category?.seo
                        ?.keywords || [],
            })
            );

            const response = await authApi.updateCategory(slug, formData);

            if (response.success) {
                setCategory(response.data);
                setSeoEdit(false);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUpdateLoading(false);
        }
    }

    async function deleteCategory() {
        const confirmDelete = confirm("Delete this category?");
        if (!confirmDelete) {
            return;
        }
        try {
            setUpdateLoading(true);
            const response =
                await authApi.deleteCategory(
                    slug
                );
            if (response.success) {
                navigate("/categories");
            }
        } catch (err) {
            console.log(err);
            alert(
                err?.message || "Delete failed"
            );
        } finally {
            setUpdateLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="adminPage">
                Loading...
            </div>
        );
    }

    if (!category) {
        return (
            <div className="adminPage">
                Category not found
            </div>
        );
    }

    return (
        <div className="adminPage">
            <div className="adminPageTop">
                <div>
                    <h1 className="adminPageTitle">
                        Category Details
                    </h1>
                    <div className="muted">
                        View and manage category.
                    </div>
                </div>
                <button className="adminBtn" onClick={() => navigate(-1)} >
                    Back
                </button>
            </div>
            {/* HERO */}
            <div className="adminPanel" style={{ marginTop: 18 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "center", }}>
                    <div style={{ width: 140, height: 140, borderRadius: 14, overflow: "hidden", background: "#111", flexShrink: 0, }} >
                        {category.thumbnail ? (
                            <img src={`https://pushpanjaliglobal.com${category.thumbnail}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", }} />) : null}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 30, }}>
                            {category.name}
                        </h2>
                        <div className="muted" style={{ marginTop: 6, }}>
                            /{category.slug}
                        </div>
                        <div className="muted">
                            Status:
                            {" "}
                            {category.is_active ? "Active" : "Inactive"}
                        </div>

                        <div className="muted">
                            Created:
                            {" "}
                            {new Date(category.createdAt).toLocaleString()}
                        </div>

                        <div className="muted">
                            Updated:
                            {" "}
                            {new Date(category.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* BASIC INFO */}
            <div className="adminPanel" style={{ marginTop: 18 }}>
                <div className="adminTableTop">
                    <div className="adminTableTitle">
                        Basic Information
                    </div>
                    {!basicEdit ? (
                        <button className="adminBtn" onClick={() => setBasicEdit(true)}>
                            Edit
                        </button>)
                        : (
                            <div style={{ display: "flex", gap: 10, }}>
                                <button className="adminBtn adminBtnPrimary" disabled={updateLoading} onClick={updateBasicInfo}>
                                    Save
                                </button>

                                <button className="adminBtn" onClick={() => setBasicEdit(false)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                </div>

                {!basicEdit ? (

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        <div className="field">

                            <div className="label">
                                Category Name
                            </div>

                            <div>
                                {category.name}
                            </div>

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Slug
                            </div>

                            <div>
                                {category.slug}
                            </div>

                        </div>

                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        <div className="field">

                            <div className="label">
                                Category Name
                            </div>

                            <input
                                className="input"
                                value={category.name}
                                onChange={(e) =>
                                    setCategory(
                                        (prev) => ({
                                            ...prev,
                                            name:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Slug
                            </div>

                            <input
                                className="input"
                                value={category.slug}
                                onChange={(e) =>
                                    setCategory(
                                        (prev) => ({
                                            ...prev,
                                            slug:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Thumbnail
                            </div>

                            <input
                                type="file"
                                className="input"
                                onChange={(e) => {

                                    const file =
                                        e.target.files?.[0];

                                    if (!file) return;

                                    setThumbnailFile(
                                        file
                                    );
                                }}
                            />

                        </div>

                    </div>
                )}

            </div>

            {/* SEO */}
            <div
                className="adminPanel"
                style={{ marginTop: 18 }}
            >

                <div className="adminTableTop">

                    <div className="adminTableTitle">
                        SEO Information
                    </div>

                    {!seoEdit ? (

                        <button
                            className="adminBtn"
                            onClick={() =>
                                setSeoEdit(true)
                            }
                        >
                            Edit
                        </button>

                    ) : (

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                            }}
                        >

                            <button
                                className="adminBtn adminBtnPrimary"
                                disabled={
                                    updateLoading
                                }
                                onClick={
                                    updateSeo
                                }
                            >
                                Save
                            </button>

                            <button
                                className="adminBtn"
                                onClick={() =>
                                    setSeoEdit(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>
                    )}

                </div>

                {!seoEdit ? (

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        <div className="field">

                            <div className="label">
                                Meta Title
                            </div>

                            <div>
                                {
                                    category?.seo
                                        ?.meta_title
                                }
                            </div>

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Meta Description
                            </div>

                            <div>
                                {
                                    category?.seo
                                        ?.meta_description
                                }
                            </div>

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Keywords
                            </div>

                            <div>
                                {category?.seo?.keywords?.join(
                                    ", "
                                )}
                            </div>

                        </div>

                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        <div className="field">

                            <div className="label">
                                Meta Title
                            </div>

                            <input
                                className="input"
                                value={
                                    category?.seo
                                        ?.meta_title
                                }
                                onChange={(e) =>
                                    setCategory(
                                        (prev) => ({
                                            ...prev,

                                            seo: {
                                                ...prev.seo,

                                                meta_title:
                                                    e.target.value,
                                            },
                                        })
                                    )
                                }
                            />

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Meta Description
                            </div>

                            <textarea
                                className="input"
                                value={
                                    category?.seo
                                        ?.meta_description
                                }
                                onChange={(e) =>
                                    setCategory(
                                        (prev) => ({
                                            ...prev,

                                            seo: {
                                                ...prev.seo,

                                                meta_description:
                                                    e.target.value,
                                            },
                                        })
                                    )
                                }
                            />

                        </div>

                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Keywords
                            </div>

                            <input
                                className="input"
                                value={
                                    keywordInput
                                }
                                onChange={(e) => {

                                    const value =
                                        e.target.value;

                                    setKeywordInput(
                                        value
                                    );

                                    setCategory(
                                        (prev) => ({
                                            ...prev,

                                            seo: {
                                                ...prev.seo,

                                                keywords:
                                                    value
                                                        .split(",")
                                                        .map((k) =>
                                                            k.trim()
                                                        )
                                                        .filter(Boolean),
                                            },
                                        })
                                    );
                                }}
                            />

                        </div>

                    </div>
                )}

            </div>

            {/* DELETE */}
            <div
                className="adminPanel"
                style={{
                    marginTop: 18,
                    border:
                        "1px solid rgba(255,0,0,.2)",
                }}
            >

                <div className="adminTableTop">

                    <div>

                        <div className="adminTableTitle">
                            Danger Zone
                        </div>

                        <div className="muted">
                            Permanently delete this
                            category.
                        </div>

                    </div>

                    <button
                        className="adminBtn"
                        disabled={updateLoading}
                        onClick={
                            deleteCategory
                        }
                        style={{
                            border:
                                "1px solid rgba(255,0,0,.3)",
                        }}
                    >
                        Delete Category
                    </button>

                </div>

            </div>

        </div>
    );
}