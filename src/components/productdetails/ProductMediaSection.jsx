import { useEffect, useState, } from "react";
import {
    useNavigate,
} from "react-router-dom";

import { authApi } from "../../lib/authapi";

export default function ProductMediaSection({ product }) {

    const navigate =
        useNavigate();

    const [loading,
        setLoading] =
        useState(false);

    const [editing,
        setEditing] =
        useState(false);

    const [media,
        setMedia] =
        useState(null);

    const [newImages,
        setNewImages] =
        useState([]);

    const [newVideos,
        setNewVideos] =
        useState([]);

    useEffect(() => {
        async function loadMedia() {
            try {
                const response = await authApi.getProductMediaByProductId(product._id);

                if (response.success) {
                    setMedia(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (
            product?._id
        ) {

            loadMedia();
        }

    }, [product]);

    async function saveMedia() {

        console.log(product._id)

        if (!media?._id) {
            if (
                !product?._id
            ) {

                alert(
                    "Product not loaded"
                );

                return;
            }

            try {

                setLoading(true);

                const formData = new FormData();

                formData.append(
                    "product_id",
                    product._id
                );

                newImages.forEach((file) => {

                    formData.append(
                        "images",
                        file
                    );
                });

                newVideos.forEach((file) => {

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

                    setMedia(response.data);
                    setNewImages([]);
                    setNewVideos([]);
                    setEditing(false);
                }

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        }

        try {
            setLoading(true);

            const formData = new FormData();

            newImages.forEach((file) => {
                formData.append("images", file);
            }
            );

            newVideos.forEach((file) => {
                formData.append("videos", file);
            }
            );

            const response = await authApi.updateProductMedia(media._id, formData);
            if (response.success) {
                setMedia(response.data);
                setNewImages([]);
                setNewVideos([]);
                setEditing(false);
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    async function deleteImage(
        image
    ) {

        try {

            const response =
                await authApi
                    .deleteProductMediaFile(
                        media._id,
                        {
                            image,
                        }
                    );

            if (
                response.success
            ) {

                setMedia(
                    response.data
                );
            }

        } catch (err) {

            console.log(err);
        }
    }

    async function deleteVideo(
        video
    ) {

        try {

            const response =
                await authApi
                    .deleteProductMediaFile(
                        media._id,
                        {
                            video,
                        }
                    );

            if (
                response.success
            ) {

                setMedia(
                    response.data
                );
            }

        } catch (err) {

            console.log(err);
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
                }}
            >

                <h2>
                    Product Media
                </h2>

                {!editing ? (
                    <button className="adminBtn" onClick={() => setEditing(true)}>
                        Edit Media
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
                            onClick={() => {

                                setNewImages([]);

                                setNewVideos([]);

                                setEditing(false);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="adminBtn adminBtnPrimary"
                            disabled={
                                loading
                            }
                            onClick={
                                saveMedia
                            }
                        >
                            {
                                loading
                                    ? "Saving..."
                                    : "Save Media"
                            }
                        </button>

                    </div>

                )}

            </div>

            <h3
                style={{
                    marginTop: 20,
                }}
            >
                Images
            </h3>

            <div
                style={{
                    display: "flex",
                    flexWrap:
                        "wrap",
                    gap: 12,
                }}
            >

                {media?.images?.map(
                    (
                        image
                    ) => (

                        <div
                            key={image}
                        >

                            <img
                                src={`https://pushpanjaliglobal.com${image}`}
                                alt="product"
                                style={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 10,
                                }}
                            />

                            {editing && (

                                <button
                                    className="adminBtn"
                                    style={{
                                        marginTop: 6,
                                    }}
                                    onClick={() =>
                                        deleteImage(
                                            image
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            )}

                        </div>
                    )
                )}

            </div>

            {editing && (

                <div
                    style={{
                        marginTop: 15,
                    }}
                >

                    <input
                        type="file"
                        multiple
                        accept="image/*"

                        onChange={(e) => {
                            const files =
                                Array.from(
                                    e.target.files || []
                                );

                            setNewImages(
                                prev => [
                                    ...prev,
                                    ...files,
                                ]
                            );
                        }
                        }
                    />

                    {newImages.map(
                        (
                            file,
                            index
                        ) => (

                            <div
                                key={index}
                            >

                                {file.name}

                                <button
                                    className="adminBtn"
                                    style={{
                                        marginLeft: 10,
                                    }}
                                    onClick={() => {

                                        setNewImages(
                                            prev =>
                                                prev.filter(
                                                    (
                                                        _,
                                                        i
                                                    ) =>
                                                        i !== index
                                                )
                                        );
                                    }}
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    )}

                    <div
                        style={{
                            marginTop: 10,
                        }}
                    >
                        Selected:
                        {" "}
                        {
                            newImages.length
                        }
                    </div>

                </div>

            )}

            <h3
                style={{
                    marginTop: 25,
                }}
            >
                Videos
            </h3>

            <div
                style={{
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: 15,
                }}
            >

                {media?.videos?.map(
                    (
                        video
                    ) => (

                        <div
                            key={video}
                        >

                            <video
                                controls
                                width="300"
                            >
                                <source
                                    src={`https://pushpanjaliglobal.com${video}`}
                                />
                            </video>

                            {editing && (

                                <button
                                    className="adminBtn"
                                    style={{
                                        marginTop: 6,
                                    }}
                                    onClick={() =>
                                        deleteVideo(
                                            video
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            )}

                        </div>
                    )
                )}

            </div>

            {editing && (

                <div
                    style={{
                        marginTop: 15,
                    }}
                >

                    <input
                        type="file"
                        multiple
                        accept="video/*"

                        onChange={(
                            e
                        ) => {
                            const files =
                                Array.from(
                                    e.target.files || []
                                );

                            setNewVideos(prev => [...prev, ...files,]);
                        }
                        }
                    />
                    {newVideos.map(
                        (
                            file,
                            index
                        ) => (

                            <div
                                key={index}
                            >

                                {file.name}

                                <button
                                    className="adminBtn"
                                    style={{
                                        marginLeft: 10,
                                    }}
                                    onClick={() => {

                                        setNewVideos(
                                            prev =>
                                                prev.filter(
                                                    (
                                                        _,
                                                        i
                                                    ) =>
                                                        i !== index
                                                )
                                        );
                                    }}
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    )}

                    <div
                        style={{
                            marginTop: 10,
                        }}
                    >
                        Selected:
                        {" "}
                        {
                            newVideos.length
                        }
                    </div>

                </div>

            )}

        </div>
    );
}