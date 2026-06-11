import {
    useState,
} from "react";

import { authApi }
    from "../../lib/authapi";

export default function ProductSeoSection({

    product,

    setProduct,

}) {

    const [editing,
        setEditing] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const [keywordInput,
        setKeywordInput] =
        useState("");

    const [form,
        setForm] =
        useState({

            meta_title:
                product.seo
                    ?.meta_title || "",

            meta_description:
                product.seo
                    ?.meta_description || "",

            keywords:
                product.seo
                    ?.keywords || [],
        });

    function handleCancel() {

        setForm({

            meta_title:
                product.seo
                    ?.meta_title || "",

            meta_description:
                product.seo
                    ?.meta_description || "",

            keywords:
                product.seo
                    ?.keywords || [],
        });

        setKeywordInput(
            ""
        );

        setEditing(
            false
        );
    }

    function addKeyword() {

        const value =
            keywordInput.trim();

        if (!value) {
            return;
        }

        if (
            form.keywords.includes(
                value
            )
        ) {

            setKeywordInput(
                ""
            );

            return;
        }

        setForm(
            (prev) => ({

                ...prev,

                keywords: [
                    ...prev.keywords,
                    value,
                ],
            })
        );

        setKeywordInput(
            ""
        );
    }

    function removeKeyword(
        index
    ) {

        setForm(
            (prev) => ({

                ...prev,

                keywords:
                    prev.keywords.filter(
                        (_, i) =>
                            i !==
                            index
                    ),
            })
        );
    }

    async function handleSave() {

        try {

            setLoading(
                true
            );

            const formData =
                new FormData();

            formData.append(

                "seo",

                JSON.stringify({

                    meta_title:
                        form.meta_title,

                    meta_description:
                        form.meta_description,

                    keywords:
                        [
                            ...new Set(
                                form.keywords
                            ),
                        ],
                })
            );

            const response =
                await authApi.updateProduct(

                    product._id,

                    formData
                );

            if (
                response.success
            ) {

                setProduct(
                    response.data
                );

                setEditing(
                    false
                );
            }

        } catch (err) {

            console.log(
                err
            );

        } finally {

            setLoading(
                false
            );
        }
    }

    return (

        <div
            className="adminPanel"
            style={{
                marginTop: 20,
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    marginBottom: 20,
                }}
            >

                <h2>
                    SEO
                </h2>

                {!editing ? (

                    <button
                        className="adminBtn"
                        onClick={() =>
                            setEditing(
                                true
                            )
                        }
                    >
                        Edit SEO
                    </button>

                ) : (

                    <div
                        style={{
                            display:
                                "flex",
                            gap: 10,
                        }}
                    >

                        <button
                            className="adminBtn"
                            onClick={
                                handleCancel
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="adminBtn adminBtnPrimary"
                            disabled={
                                loading
                            }
                            onClick={
                                handleSave
                            }
                        >
                            {
                                loading
                                    ? "Saving..."
                                    : "Save SEO"
                            }
                        </button>

                    </div>

                )}

            </div>

            {!editing ? (

                <>

                    <p>

                        <strong>
                            Meta Title:
                        </strong>

                        {" "}

                        {
                            product.seo
                                ?.meta_title
                        }

                    </p>

                    <p>

                        <strong>
                            Meta Description:
                        </strong>

                        {" "}

                        {
                            product.seo
                                ?.meta_description
                        }

                    </p>

                    <p>

                        <strong>
                            Keywords:
                        </strong>

                        {" "}

                        {
                            product.seo
                                ?.keywords
                                ?.join(
                                    ", "
                                )
                        }

                    </p>

                </>

            ) : (

                <div>

                    <div
                        style={{
                            marginBottom:
                                16,
                        }}
                    >

                        <label>
                            Meta Title
                        </label>

                        <input
                            className="input"

                            value={
                                form.meta_title
                            }

                            onChange={(
                                e
                            ) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        meta_title:
                                            e
                                                .target
                                                .value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            marginBottom:
                                16,
                        }}
                    >

                        <label>
                            Meta Description
                        </label>

                        <textarea
                            className="textarea"

                            value={
                                form.meta_description
                            }

                            onChange={(
                                e
                            ) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        meta_description:
                                            e
                                                .target
                                                .value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            marginBottom:
                                16,
                        }}
                    >

                        <label>
                            Keywords
                        </label>

                        <div
                            style={{
                                display:
                                    "flex",
                                gap: 10,
                            }}
                        >

                            <input
                                className="input"

                                value={
                                    keywordInput
                                }

                                onChange={(
                                    e
                                ) =>
                                    setKeywordInput(
                                        e
                                            .target
                                            .value
                                    )
                                }

                                onKeyDown={(
                                    e
                                ) => {

                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {

                                        e.preventDefault();

                                        addKeyword();
                                    }
                                }}
                            />

                            <button
                                className="adminBtn"

                                type="button"

                                onClick={
                                    addKeyword
                                }
                            >
                                Add
                            </button>

                        </div>

                    </div>

                    <div
                        style={{
                            display:
                                "flex",
                            flexWrap:
                                "wrap",
                            gap: 10,
                        }}
                    >

                        {form.keywords.map(
                            (
                                keyword,
                                index
                            ) => (

                                <button
                                    key={
                                        index
                                    }

                                    type="button"

                                    className="adminBtn"

                                    onClick={() =>
                                        removeKeyword(
                                            index
                                        )
                                    }
                                >
                                    {
                                        keyword
                                    }

                                    {" "}×

                                </button>
                            )
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}