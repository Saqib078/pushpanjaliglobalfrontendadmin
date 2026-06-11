export default function ProductHero({
    product,
}) {

    return (

        <div className="adminPanel">

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    alignItems:
                        "center",
                }}
            >

                <img
                    src={`https://pushpanjaliglobal.com${product.thumbnail}`}
                    alt={product.title}
                    style={{
                        width: 120,
                        height: 120,
                        objectFit:
                            "cover",
                        borderRadius: 12,
                    }}
                />

                <div>

                    <h1
                        style={{
                            margin: 0,
                        }}
                    >
                        {product.title}
                    </h1>

                    <div
                        className="muted"
                        style={{
                            marginTop: 8,
                        }}
                    >
                        /{product.slug}
                    </div>

                    <div
                        style={{
                            marginTop: 12,
                        }}
                    >
                        Status:
                        {" "}
                        {
                            product.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    </div>

                    <div
                        style={{
                            marginTop: 6,
                        }}
                    >
                        Created:
                        {" "}
                        {
                            new Date(
                                product.createdAt
                            ).toLocaleString()
                        }
                    </div>

                    <div
                        style={{
                            marginTop: 6,
                        }}
                    >
                        Updated:
                        {" "}
                        {
                            new Date(
                                product.updatedAt
                            ).toLocaleString()
                        }
                    </div>

                </div>

            </div>

        </div>
    );
}