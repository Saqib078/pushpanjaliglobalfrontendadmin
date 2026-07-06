import { useEffect, useState, } from "react";

import { useParams, } from "react-router-dom";

import { authApi } from "../lib/authapi";

import ProductHero from "../components/productdetails/ProductHero";

import ProductInfoSection from "../components/productdetails/ProductInfoSection";

import ProductSeoSection from "../components/productdetails/ProductSeoSection";

import ProductVariationSection from "../components/productdetails/ProductVariationSection";

import ProductStatsSection from "../components/productdetails/ProductStatsSection";

import ProductSystemInfoSection from "../components/productdetails/ProductSystemInfoSection";

import DangerZone from "../components/productdetails/DangerZone";
import ProductMediaSection from "../components/productdetails/ProductMediaSection";
import ProductInformationView from "../components/productdetails/ProductInformationView";

export default function ProductDetails() {

    const { slug } =
        useParams();

    const [productInformation, setProductInformation] = useState(null);
    // const [loading, setLoading] = useState(true);

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [editingInfo,
        setEditingInfo] =
        useState(false);

    const [productForm,
        setProductForm] =
        useState(null);

    const [thumbnailFile,
        setThumbnailFile] =
        useState(null);

    const [editingSeo,
        setEditingSeo] =
        useState(false);

    const [seoForm,
        setSeoForm] =
        useState(null);

    const [keywordInput,
        setKeywordInput] =
        useState("");
    const [editingVariations,
        setEditingVariations] =
        useState(false);

    const [variationsForm,
        setVariationsForm] =
        useState([]);

    useEffect(() => {

        async function loadProduct() {

            try {

                const response =
                    await authApi.getProductBySlug(
                        slug
                    );

                if (response.success) {

                    setProduct(
                        response.data
                    );
                    setProductForm({
                        title:
                            response.data.title,

                        sku:
                            response.data.sku,

                        short_description:
                            response.data.short_description,

                        full_description:
                            response.data.full_description,
                    });
                    setSeoForm({

                        meta_title:
                            response.data.seo
                                ?.meta_title || "",

                        meta_description:
                            response.data.seo
                                ?.meta_description || "",

                        keywords:
                            response.data.seo
                                ?.keywords || [],
                    });
                    setVariationsForm(
                        response.data.variations
                    );
                }

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        }

        loadProduct();

    }, [slug]);

    async function updateProductInfo() {

        try {

            const formData =
                new FormData();

            formData.append(
                "title",
                productForm.title
            );

            formData.append(
                "sku",
                productForm.sku
            );

            formData.append(
                "short_description",
                productForm.short_description
            );

            formData.append(
                "full_description",
                productForm.full_description
            );

            if (thumbnailFile) {

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

            if (response.success) {

                setProduct(
                    response.data
                );
                setProductForm({

                    title:
                        response.data.title,

                    sku:
                        response.data.sku,

                    short_description:
                        response.data.short_description,

                    full_description:
                        response.data.full_description,
                });

                setEditingInfo(
                    false
                );
            }

        } catch (err) {

            console.log(err);
        }
    }

    async function updateSeo() {

        try {

            const formData =
                new FormData();

            formData.append(
                "seo",
                JSON.stringify(
                    seoForm
                )
            );

            const response =
                await authApi.updateProduct(
                    product._id,
                    formData
                );

            if (response.success) {

                setProduct(
                    response.data
                );

                setSeoForm({

                    meta_title:
                        response.data.seo
                            ?.meta_title || "",

                    meta_description:
                        response.data.seo
                            ?.meta_description || "",

                    keywords:
                        response.data.seo
                            ?.keywords || [],
                });

                setEditingSeo(
                    false
                );
            }

        } catch (err) {

            console.log(err);
        }
    }

    async function updateVariations() {

        try {

            const formData =
                new FormData();

            formData.append(
                "variations",
                JSON.stringify(
                    variationsForm
                )
            );

            const response =
                await authApi.updateProduct(
                    product._id,
                    formData
                );

            if (response.success) {

                setProduct(
                    response.data
                );

                setVariationsForm(
                    response.data.variations
                );

                setEditingVariations(
                    false
                );
            }

        } catch (err) {

            console.log(err);
        }
    }

    useEffect(() => {

        if (product?._id) {
            getProductInformation();
        }

    }, [product]);

    const getProductInformation = async () => {

        try {

            const response = await axiosInstance.get(
                `/product-information/${product._id}`
            );

            setProductInformation(response.data.data);

        } catch (error) {

            if (error.response?.status === 404) {
                setProductInformation(null);
            }

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="adminPage">
                Loading...
            </div>
        );
    }

    if (!product) {

        return (
            <div className="adminPage">
                Product not found
            </div>
        );
    }

    return (

        <div className="adminPage">

            <ProductHero
                product={product}
            />

            <ProductInfoSection
                product={product}
                setProduct={setProduct}
            />

            <ProductInformationView
                productId={product._id}
                onEdit={() => navigate()}
            />

            <ProductSeoSection
                product={product}
                setProduct={setProduct}
            />

            <ProductVariationSection
                product={product}
                setProduct={setProduct}
            />

            <ProductStatsSection
                product={product}
            />

            <ProductSystemInfoSection
                product={product}
            />


            <ProductMediaSection
                product={product}
            />

            <DangerZone
                product={product}
            />

        </div>
    );
}