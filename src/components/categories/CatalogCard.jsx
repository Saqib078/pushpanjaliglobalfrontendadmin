import { useNavigate } from "react-router-dom";

export default function CatalogCard({
    catalog,
}) {

    const navigate =
        useNavigate();


    return (
        <div className="adminPanel">

            {/* IMAGE */}
            <div
                style={{
                    width: "100%",
                    height: 220,

                    borderRadius: 12,

                    overflow: "hidden",

                    background: "#111",
                }}
            >

                {catalog.thumbnail ? (

                    <img
                        src={`https://pushpanjaliglobal.com${catalog.thumbnail}`}
                        alt=""

                        style={{
                            width: "100%",
                            height: "100%",

                            objectFit: "cover",
                        }}
                    />

                ) : null}

            </div>

            {/* CONTENT */}
            <div
                style={{
                    marginTop: 16,
                }}
            >

                <h2
                    style={{
                        margin: 0,

                        fontSize: 22,
                    }}
                >
                    {catalog.name}
                </h2>

                <div
                    className="muted"

                    style={{
                        marginTop: 6,
                    }}
                >
                    /{catalog.slug}
                </div>

                <div
                    style={{
                        marginTop: 14,

                        minHeight: 48,

                        lineHeight: 1.5,
                    }}
                >
                    {catalog.seo.meta_description ||
                        "No description added."}
                </div>

            </div>

            {/* ACTION */}
            <div
                style={{
                    marginTop: 18,
                }}
            >
                <button
                    className="adminBtn adminBtnPrimary"

                    onClick={() =>
                        navigate(
                            `/catagories/${catalog.slug}/product`
                        )
                    }
                >
                    View Products
                </button>
            </div>
        </div>
    );
}