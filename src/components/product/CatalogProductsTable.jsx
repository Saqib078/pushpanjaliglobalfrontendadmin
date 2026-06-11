import { useNavigate } from "react-router-dom";

export default function CatalogProductsTable({
    products,
    catalog,
}) {

    const navigate =
        useNavigate();

    return (
        <div
            className="adminTableWrap"
            style={{
                marginTop: 20,
            }}
        >

            {/* TOP */}
            <div className="adminTableTop">

                <div className="adminTableTitle">
                    Products
                </div>

                <button
                    className="adminBtn adminBtnPrimary"
                    onClick={() =>
                        navigate(
                            `/catalogs/${catalog.slug}/add-product`
                        )
                    }
                >
                    + Add Product
                </button>

            </div>

            {/* SEARCH */}
            <div
                style={{
                    marginTop: 16,
                }}
            >

                <input
                    className="input"

                    placeholder="Search products..."
                />

            </div>

            {/* EMPTY */}
            {products.length === 0 ? (

                <div
                    className="adminPanel"
                    style={{
                        marginTop: 18,

                        textAlign: "center",

                        padding: 40,
                    }}
                >

                    <div
                        className="muted"
                    >
                        No products found in this
                        catalog.
                    </div>

                </div>

            ) : (

                <table
                    className="adminTable"
                    style={{
                        marginTop: 18,
                    }}
                >

                    <thead>

                        <tr>

                            <th>Image</th>

                            <th>Name</th>

                            <th>sku</th>

                            <th>variation count</th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {products.map(
                            (product) => (

                                <tr
                                    key={product._id}
                                >

                                    {/* IMAGE */}
                                    <td>

                                        {product.thumbnail ? (

                                            <img
                                                src={`https://pushpanjaliglobal.com${product.thumbnail}`}

                                                alt=""

                                                style={{
                                                    width: 50,

                                                    height: 50,

                                                    objectFit:
                                                        "cover",

                                                    borderRadius: 8,
                                                }}
                                            />

                                        ) : null}

                                    </td>

                                    {/* NAME */}
                                    <td>

                                        <div
                                            style={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            {product.title}
                                        </div>

                                        <div
                                            className="muted"
                                        >
                                            /{product.slug}
                                        </div>

                                    </td>

                                    {/* PRICE */}
                                    <td>
                                        {product.sku}
                                    </td>

                                    {/* STOCK */}
                                    <td>
                                        {product.variations.length}
                                    </td>

                                    {/* STATUS */}
                                    <td>

                                        {product.is_active
                                            ? "Active"
                                            : "Inactive"}

                                    </td>

                                    {/* ACTION */}
                                    <td>

                                        <button
                                            className="adminBtn"

                                            onClick={() =>
                                                navigate(
                                                    `/products/${product.slug}`
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>
            )}

        </div>
    );
}