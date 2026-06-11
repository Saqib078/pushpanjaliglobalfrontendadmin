import {
    useState,
    useEffect,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { authApi } from "../lib/authapi";

export default function AddProduct() {

    const navigate =
        useNavigate();

    const { slug } =
        useParams();

    const [loading, setLoading] =
        useState(false);

    const [
        thumbnailFile,
        setThumbnailFile,
    ] = useState(null);

    const [
        category,
        setCategory,
    ] = useState(null);

    const [form, setForm] =
        useState({

            title: "",

            sku: "",

            short_description: "",

            full_description: "",

            seo: {
                meta_title: "",

                meta_description: "",

                keywords: [],
            },

            variations: [],
        });

    const [
        keywordInput,
        setKeywordInput,
    ] = useState("");

    useEffect(() => {

        async function loadCategory() {

            try {

                const response =
                    await authApi.getCategoryBySlug(
                        slug
                    );

                setCategory(
                    response.data
                );

            } catch (err) {

                console.log(err);
            }
        }

        loadCategory();

    }, [slug]);

    async function saveProduct(
        e
    ) {

        e.preventDefault();

        try {

            setLoading(true);

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

            formData.append(
                "category_id",
                category?._id
            );

            formData.append(
                "product_picture",
                thumbnailFile
            );

            formData.append(
                "seo",
                JSON.stringify(
                    form.seo
                )
            );

            formData.append(
                "variations",
                JSON.stringify(
                    form.variations
                )
            );

            const res = await authApi.createProduct(
                formData
            );
            console.log(res)
            console.log(res.success ? `${res.success}`:"Fail")
            if (res.success) {
                navigate(
                    `/products/${res.product.slug}/media`
                );
            }

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }

    function addVariation() {

        setForm((prev) => ({
            ...prev,

            variations: [
                ...prev.variations,

                {
                    label: "",

                    mrp: "",

                    price: "",

                    stock: "",

                    sku: "",

                    is_active: true,
                },
            ],
        }));
    }

    function updateVariation(
        index,
        field,
        value
    ) {

        setForm((prev) => {

            const updated =
                [...prev.variations];

            updated[index][field] =
                value;

            return {
                ...prev,

                variations: updated,
            };
        });
    }

    function removeVariation(
        index
    ) {

        setForm((prev) => ({
            ...prev,

            variations:
                prev.variations.filter(
                    (_, i) =>
                        i !== index
                ),
        }));
    }

    return (
        <div className="adminPage">

            {/* TOP */}
            <div className="adminPageTop">

                <div>

                    <h1 className="adminPageTitle">
                        Add Product
                    </h1>

                    <div className="muted">
                        Create product details.
                    </div>

                </div>

            </div>

            <form
                onSubmit={saveProduct}
            >

                {/* BASIC */}
                <div
                    className="adminPanel"
                    style={{
                        marginTop: 20,
                    }}
                >

                    <div className="adminTableTitle">
                        Basic Information
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        {/* TITLE */}
                        <div className="field">

                            <div className="label">
                                Product Title
                            </div>

                            <input
                                className="input"

                                required

                                value={form.title}

                                onChange={(e) =>
                                    setForm(
                                        (prev) => ({
                                            ...prev,

                                            title:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                        </div>


                        {/* SKU */}
                        <div
                            className="field"
                            style={{
                                marginTop: 16,
                            }}
                        >

                            <div className="label">
                                Product SKU
                            </div>

                            <input
                                className="input"

                                required

                                value={form.sku}

                                onChange={(e) =>
                                    setForm(
                                        (prev) => ({
                                            ...prev,

                                            sku:
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
                                Product Thumbnail
                            </div>

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

                </div>

                {/* DESCRIPTION */}
                <div
                    className="adminPanel"
                    style={{
                        marginTop: 20,
                    }}
                >

                    <div className="adminTableTitle">
                        Descriptions
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >

                        <div className="field">

                            <div className="label">
                                Short Description
                            </div>

                            <textarea
                                className="input"

                                required

                                value={
                                    form.short_description
                                }

                                onChange={(e) =>
                                    setForm(
                                        (prev) => ({
                                            ...prev,

                                            short_description:
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
                                Full Description
                            </div>

                            <textarea
                                className="input"

                                required

                                rows={8}

                                value={
                                    form.full_description
                                }

                                onChange={(e) =>
                                    setForm(
                                        (prev) => ({
                                            ...prev,

                                            full_description:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* SEO */}
                <div
                    className="adminPanel"
                    style={{
                        marginTop: 20,
                    }}
                >

                    <div className="adminTableTitle">
                        SEO
                    </div>

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
                                    form.seo
                                        .meta_title
                                }

                                onChange={(e) =>
                                    setForm(
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
                                    form.seo
                                        .meta_description
                                }

                                onChange={(e) =>
                                    setForm(
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

                                    setForm(
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

                </div>

                {/* VARIATIONS */}
                <div
                    className="adminPanel"
                    style={{
                        marginTop: 20,
                    }}
                >

                    <div className="adminTableTop">

                        <div className="adminTableTitle">
                            Variations
                        </div>

                        <button
                            type="button"

                            className="adminBtn"

                            onClick={
                                addVariation
                            }
                        >
                            + Add Variation
                        </button>

                    </div>

                    {form.variations.map(
                        (
                            variation,
                            index
                        ) => (

                            <div
                                key={index}

                                style={{
                                    marginTop: 20,

                                    padding: 16,

                                    border:
                                        "1px solid rgba(255,255,255,.08)",

                                    borderRadius: 12,
                                }}
                            >

                                <div
                                    style={{
                                        display: "grid",

                                        gridTemplateColumns:
                                            "repeat(3,1fr)",

                                        gap: 16,
                                    }}
                                >

                                    <input
                                        className="input"

                                        placeholder="Label"

                                        value={
                                            variation.label
                                        }

                                        onChange={(e) =>
                                            updateVariation(
                                                index,
                                                "label",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"

                                        placeholder="MRP"

                                        type="number"

                                        value={
                                            variation.mrp
                                        }

                                        onChange={(e) =>
                                            updateVariation(
                                                index,
                                                "mrp",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"

                                        placeholder="Price"

                                        type="number"

                                        value={
                                            variation.price
                                        }

                                        onChange={(e) =>
                                            updateVariation(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"

                                        placeholder="Stock"

                                        type="number"

                                        value={
                                            variation.stock
                                        }

                                        onChange={(e) =>
                                            updateVariation(
                                                index,
                                                "stock",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"

                                        placeholder="SKU"

                                        value={
                                            variation.sku
                                        }

                                        onChange={(e) =>
                                            updateVariation(
                                                index,
                                                "sku",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <button
                                    type="button"

                                    className="adminBtn"

                                    style={{
                                        marginTop: 14,
                                    }}

                                    onClick={() =>
                                        removeVariation(
                                            index
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    )}

                </div>

                {/* ACTION */}
                <div
                    style={{
                        marginTop: 20,

                        display: "flex",

                        gap: 12,
                    }}
                >

                    <button
                        type="submit"

                        disabled={loading}

                        className="adminBtn adminBtnPrimary"
                    >
                        Save & Continue
                    </button>

                </div>

            </form>

        </div>
    );
}