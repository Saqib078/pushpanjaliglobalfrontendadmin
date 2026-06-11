export default function DangerZone() {

    return (

        <div
            className="adminPanel"
            style={{
                marginTop: 20,
                border:
                    "1px solid #ff4d4f",
            }}
        >

            <h2>
                Danger Zone
            </h2>

            <p>
                Delete this product
                permanently.
            </p>

            <button
                className="adminBtn"
            >
                Delete Product
            </button>

        </div>
    );
}