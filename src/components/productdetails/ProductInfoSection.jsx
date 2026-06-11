import {
    useEffect,
    useState,
} from "react";

import { authApi }
    from "../../lib/authapi";

export default function ProductInfoSection({

    product,

    setProduct,

}) {

    const [editing,
        setEditing] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const [thumbnailFile,
        setThumbnailFile] =
        useState(null);

    const [form,
        setForm] =
        useState({

            title: "",
            sku: "",
            short_description: "",
            full_description: "",
        });

    useEffect(() => {

        if (!product)
            return;

        setForm({

            title:
                product.title || "",

            sku:
                product.sku || "",

            short_description:
                product.short_description || "",

            full_description:
                product.full_description || "",
        });

    }, [product]);

    function handleCancel() {

        setForm({

            title:
                product.title || "",

            sku:
                product.sku || "",

            short_description:
                product.short_description || "",

            full_description:
                product.full_description || "",
        });

        setThumbnailFile(
            null
        );

        setEditing(
            false
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
                "title",
                form.title
            );

            formData.append(
                "sku",
                form.sku
            );

            formData.append(
                "short_description",
                form.short_description
            );

            formData.append(
                "full_description",
                form.full_description
            );

            if (
                thumbnailFile
            ) {

                formData.append(
                    "product_picture",
                    thumbnailFile
                );
            }

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

                setThumbnailFile(
                    null
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
                    Product Information
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
                        Edit Product
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
                                    : "Save Product"
                            }
                        </button>

                    </div>

                )}

            </div>

            {!editing ? (

                <>

                    <p>
                        <strong>
                            Title:
                        </strong>
                        {" "}
                        {
                            product.title
                        }
                    </p>

                    <p>
                        <strong>
                            SKU:
                        </strong>
                        {" "}
                        {
                            product.sku
                        }
                    </p>

                    <p>
                        <strong>
                            Short Description:
                        </strong>
                        {" "}
                        {
                            product.short_description
                        }
                    </p>

                    <p>
                        <strong>
                            Full Description:
                        </strong>
                        {" "}
                        {
                            product.full_description
                        }
                    </p>

                </>

            ) : (

                <div>

                    <div
                        style={{
                            marginBottom: 15,
                        }}
                    >

                        <label>
                            Title
                        </label>

                        <input
                            className="input"
                            value={
                                form.title
                            }
                            onChange={(e) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        title:
                                            e.target.value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            marginBottom: 15,
                        }}
                    >

                        <label>
                            SKU
                        </label>

                        <input
                            className="input"
                            value={
                                form.sku
                            }
                            onChange={(e) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        sku:
                                            e.target.value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            marginBottom: 15,
                        }}
                    >

                        <label>
                            Short Description
                        </label>

                        <textarea
                            className="textarea"
                            value={
                                form.short_description
                            }
                            onChange={(e) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        short_description:
                                            e.target.value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div
                        style={{
                            marginBottom: 15,
                        }}
                    >

                        <label>
                            Full Description
                        </label>

                        <textarea
                            className="textarea"
                            rows={6}
                            value={
                                form.full_description
                            }
                            onChange={(e) =>
                                setForm(
                                    (
                                        prev
                                    ) => ({

                                        ...prev,

                                        full_description:
                                            e.target.value,
                                    })
                                )
                            }
                        />

                    </div>

                    <div>

                        <label>
                            Thumbnail
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setThumbnailFile(
                                    e.target.files?.[0]
                                )
                            }
                        />

                    </div>

                </div>

            )}

        </div>
    );
}