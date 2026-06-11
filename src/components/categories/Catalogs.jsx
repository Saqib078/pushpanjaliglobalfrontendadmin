import { useEffect, useState } from "react";

import { authApi } from "../../lib/authapi";

import CatalogCard from "./CatalogCard";

export default function Catalogs() {

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    async function loadCatalogs() {

        try {

            setLoading(true);

            const data =
                await authApi.listCategories();
            console.log(data);
            if (data.success) {
                setItems(
                    (data.data || []).filter(
                        (item) => item.is_active
                    )
                );
            }


        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        loadCatalogs();

    }, []);

    return (
        <div className="adminPage">

            <div className="adminPageTop">

                <div>

                    <h1 className="adminPageTitle">
                        Catalogs
                    </h1>

                    <div className="muted">
                        Manage catalogs and their
                        products.
                    </div>

                </div>

            </div>

            {loading ? (

                <div
                    style={{
                        marginTop: 20,
                    }}
                >
                    Loading...
                </div>

            ) : (

                <div
                    style={{
                        marginTop: 20,

                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(280px, 1fr))",

                        gap: 18,
                    }}
                >

                    {items.map((catalog) => (
                        <CatalogCard
                            key={catalog._id}
                            catalog={catalog}
                        />
                    ))}

                </div>
            )}

        </div>
    );
}