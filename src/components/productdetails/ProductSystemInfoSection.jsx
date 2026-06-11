export default function ProductSystemInfoSection({
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
                System Information
            </h2>

            <p>
                Product ID:
                {" "}
                {product._id}
            </p>

            <p>
                Category ID:
                {" "}
                {
                    product.category_id
                }
            </p>

        </div>
    );
}