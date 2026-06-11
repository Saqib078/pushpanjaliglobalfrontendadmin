export default function ProductStatsSection({
    product,
}) {

    return (

        <div
            className="adminPanel"
            style={{
                marginTop: 20,
            }}
        >

            <h2>
                Statistics
            </h2>

            <p>
                Rating:
                {" "}
                {
                    product.rating_avg
                }
            </p>

            <p>
                Reviews:
                {" "}
                {
                    product.total_reviews
                }
            </p>

            <p>
                Sales:
                {" "}
                {
                    product.total_sales
                }
            </p>

        </div>
    );
}