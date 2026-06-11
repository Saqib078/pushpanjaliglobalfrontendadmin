import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { authApi } from "../../lib/authapi";

import CatalogHero from "../product/CatalogHero";

import CatalogProductsTable from "../product/CatalogProductsTable";

export default function CatalogDetails() {

    const { slug } =
        useParams();

    const [loading, setLoading] =
        useState(true);

    const [catalog, setCatalog] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    async function loadData() {

        try {

            setLoading(true);

            const [
                catalogResponse,
                productResponse,
            ] = await Promise.all([
                authApi.getCategoryBySlug(
                    slug
                ),

                authApi.getCatalogProducts(
                    slug
                ),
            ]);

            setCatalog(
                catalogResponse.data
            );

            setProducts(
                productResponse.data || []
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        if (slug) {
            loadData();
        }

    }, [slug]);

    if (loading) {

        return (
            <div className="adminPage">
                Loading...
            </div>
        );
    }

    if (!catalog) {

        return (
            <div className="adminPage">
                Catalog not found
            </div>
        );
    }

    return (
        <div className="adminPage">

            <CatalogHero
                catalog={catalog}
            />

            <CatalogProductsTable
                products={products}
                catalog={catalog}
            />

        </div>
    );
}