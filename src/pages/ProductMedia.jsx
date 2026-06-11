import { useEffect, useState } from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import { authApi } from "../lib/authapi";

export default function ProductMedia() {

    const { slug } =
        useParams();

    const navigate =
        useNavigate();

    const [images, setImages] =
        useState([]);

    const [videos, setVideos] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [productId, setProductId] =
        useState("");

    useEffect(() => {

        async function loadProduct() {

            try {

                const response =
                    await authApi.getProductBySlug(
                        slug
                    );

                if (response.success) {

                    setProductId(
                        response.data._id
                    );
                }

            } catch (err) {

                console.log(err);
            }
        }

        if (slug) {
            loadProduct();
        }

    }, [slug]);

    function removeImage(index) {

        setImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    }

    function removeVideo(index) {

        setVideos((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    }

    async function saveMedia() {

        if (!productId) {

            alert(
                "Product not loaded"
            );

            return;
        }

        try {

            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "product_id",
                productId
            );

            images.forEach((file) => {

                formData.append(
                    "images",
                    file
                );
            });

            videos.forEach((file) => {

                formData.append(
                    "videos",
                    file
                );
            });

            const response =
                await authApi.createProductMedia(
                    formData
                );

            console.log(response);

            if (response.success) {

                navigate(
                    `/products/${slug}`
                );
            }

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="adminPage">

            <div className="adminPageTop">

                <div>

                    <h1 className="adminPageTitle">
                        Product Media
                    </h1>

                    <div className="muted">
                        Upload product images and videos.
                    </div>

                </div>

            </div>

            {/* IMAGES */}

            {/* IMAGES */}

            <div
                className="adminPanel"
                style={{
                    marginTop: 20,
                }}
            >

                <div className="adminTableTop">

                    <div className="adminTableTitle">
                        Images
                    </div>

                    <input
                        type="file"
                        accept="image/*"

                        onChange={(e) => {

                            const file =
                                e.target.files?.[0];

                            if (!file) return;

                            setImages((prev) => [
                                ...prev,
                                file,
                            ]);

                            e.target.value = "";
                        }}
                    />

                </div>

                <div
                    style={{
                        marginTop: 20,
                    }}
                >

                    {images.length === 0 ? (

                        <div className="muted">
                            No images selected
                        </div>

                    ) : (

                        images.map(
                            (image, index) => (

                                <div
                                    key={index}
                                    style={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        marginBottom: 10,

                                        padding: 10,

                                        border:
                                            "1px solid rgba(255,255,255,.08)",

                                        borderRadius: 8,
                                    }}
                                >

                                    <span>
                                        {image.name}
                                    </span>

                                    <button
                                        type="button"

                                        className="adminBtn"

                                        onClick={() =>
                                            removeImage(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>
                            )
                        )
                    )}

                </div>

            </div>

            {/* VIDEOS */}

            <div
                className="adminPanel"
                style={{
                    marginTop: 20,
                }}
            >

                <div className="adminTableTop">

                    <div className="adminTableTitle">
                        Videos
                    </div>

                    <input
                        type="file"
                        accept="video/*"

                        onChange={(e) => {

                            const file =
                                e.target.files?.[0];

                            if (!file) return;

                            setVideos((prev) => [
                                ...prev,
                                file,
                            ]);

                            e.target.value = "";
                        }}
                    />

                </div>

                <div
                    style={{
                        marginTop: 20,
                    }}
                >

                    {videos.length === 0 ? (

                        <div className="muted">
                            No videos selected
                        </div>

                    ) : (

                        videos.map(
                            (video, index) => (

                                <div
                                    key={index}
                                    style={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "center",

                                        marginBottom: 10,

                                        padding: 10,

                                        border:
                                            "1px solid rgba(255,255,255,.08)",

                                        borderRadius: 8,
                                    }}
                                >

                                    <span>
                                        {video.name}
                                    </span>

                                    <button
                                        type="button"

                                        className="adminBtn"

                                        onClick={() =>
                                            removeVideo(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>
                            )
                        )
                    )}

                </div>

            </div>

            {/* ACTIONS */}

            <div
                style={{
                    marginTop: 20,

                    display: "flex",

                    gap: 10,
                }}
            >

                <button
                    className="adminBtn adminBtnPrimary"

                    disabled={loading}

                    onClick={saveMedia}
                >
                    {loading
                        ? "Uploading..."
                        : "Save Media"}
                </button>

                <button
                    className="adminBtn"

                    onClick={() =>
                        navigate(
                            `/products/${slug}`
                        )
                    }
                >
                    Skip
                </button>

            </div>

        </div>
    );
}