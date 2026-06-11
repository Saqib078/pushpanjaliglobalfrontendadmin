import {
    useEffect,
    useState,
} from "react";

import { authApi }
    from "../../lib/authapi";

export default function ProductVariationSection({

    product,

    setProduct,

}) {

    const [editing,
        setEditing] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const [variations,
        setVariations] =
        useState([]);

    useEffect(() => {

        setVariations(
            product.variations || []
        );

    }, [product]);

    function handleCancel() {

        setVariations(
            product.variations || []
        );

        setEditing(
            false
        );
    }

    function addVariation() {

        setVariations(
            (prev) => [

                ...prev,

                {
                    label: "",
                    mrp: 0,
                    price: 0,
                    stock: 0,
                    sku: "",
                    is_active: true,
                },
            ]
        );
    }

    function removeVariation(
        index
    ) {

        setVariations(
            (prev) =>
                prev.filter(
                    (_, i) =>
                        i !== index
                )
        );
    }

    async function handleSave() {

        try {

            setLoading(
                true
            );

            const formData =
                new FormData();

            formData.append(

                "variations",

                JSON.stringify(
                    variations
                )
            );

            const response =
                await authApi.updateProduct(

                    product._id,

                    formData
                );

            if (
                response.success
            ) {

                setProduct(
                    response.data
                );

                setEditing(
                    false
                );
            }

        } catch (err) {

            console.log(
                err
            );

        } finally {

            setLoading(
                false
            );
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
                    marginBottom: 20,
                }}
            >

                <h2>
                    Variations
                </h2>

                {!editing ? (

                    <button
                        className="adminBtn"
                        onClick={() =>
                            setEditing(
                                true
                            )
                        }
                    >
                        Edit Variations
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
                            onClick={
                                addVariation
                            }
                        >
                            Add Variation
                        </button>

                        <button
                            className="adminBtn"
                            onClick={
                                handleCancel
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="adminBtn adminBtnPrimary"
                            disabled={
                                loading
                            }
                            onClick={
                                handleSave
                            }
                        >
                            {
                                loading
                                    ? "Saving..."
                                    : "Save Variations"
                            }
                        </button>

                    </div>

                )}

            </div>

            <table
                className="adminTable"
            >

                <thead>

                    <tr>

                        <th>
                            Label
                        </th>

                        <th>
                            MRP
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Stock
                        </th>

                        <th>
                            SKU
                        </th>

                        <th>
                            Status
                        </th>

                        {editing && (
                            <th>
                                Action
                            </th>
                        )}

                    </tr>

                </thead>

                <tbody>

                    {variations.map(
                        (
                            variation,
                            index
                        ) => (

                            <tr
                                key={
                                    variation._id ||
                                    index
                                }
                            >

                                <td>

                                    {editing ? (

                                        <input
                                            className="input"
                                            value={
                                                variation.label
                                            }
                                            onChange={(e) => {

                                                const updated =
                                                    [...variations];

                                                updated[index].label =
                                                    e.target.value;

                                                setVariations(
                                                    updated
                                                );
                                            }}
                                        />

                                    ) : (

                                        variation.label

                                    )}

                                </td>

                                <td>

                                    {editing ? (

                                        <input
                                            type="number"
                                            className="input"
                                            value={
                                                variation.mrp
                                            }
                                            onChange={(e) => {

                                                const updated =
                                                    [...variations];

                                                updated[index].mrp =
                                                    Number(
                                                        e.target.value
                                                    );

                                                setVariations(
                                                    updated
                                                );
                                            }}
                                        />

                                    ) : (

                                        variation.mrp

                                    )}

                                </td>

                                <td>

                                    {editing ? (

                                        <input
                                            type="number"
                                            className="input"
                                            value={
                                                variation.price
                                            }
                                            onChange={(e) => {

                                                const updated =
                                                    [...variations];

                                                updated[index].price =
                                                    Number(
                                                        e.target.value
                                                    );

                                                setVariations(
                                                    updated
                                                );
                                            }}
                                        />

                                    ) : (

                                        variation.price

                                    )}

                                </td>

                                <td>

                                    {editing ? (

                                        <input
                                            type="number"
                                            className="input"
                                            value={
                                                variation.stock
                                            }
                                            onChange={(e) => {

                                                const updated =
                                                    [...variations];

                                                updated[index].stock =
                                                    Number(
                                                        e.target.value
                                                    );

                                                setVariations(
                                                    updated
                                                );
                                            }}
                                        />

                                    ) : (

                                        variation.stock

                                    )}

                                </td>

                                <td>

                                    {editing ? (

                                        <input
                                            className="input"
                                            value={
                                                variation.sku
                                            }
                                            onChange={(e) => {

                                                const updated =
                                                    [...variations];

                                                updated[index].sku =
                                                    e.target.value;

                                                setVariations(
                                                    updated
                                                );
                                            }}
                                        />

                                    ) : (

                                        variation.sku

                                    )}

                                </td>

                                <td>

                                    {editing ? (

                                        <select
                                            value={
                                                variation.is_active
                                                    ? "true"
                                                    : "false"
                                            }
                                            onChange={(e) => {
                                                const updated = [...variations];
                                                updated[index].is_active = e.target.value === "true";
                                                setVariations(updated);
                                            }}
                                        >

                                            <option value="true">
                                                Active
                                            </option>

                                            <option value="false">
                                                Inactive
                                            </option>

                                        </select>

                                    ) : (

                                        variation.is_active
                                            ? "Active"
                                            : "Inactive"

                                    )}

                                </td>

                                {editing && (

                                    <td>

                                        <button
                                            className="adminBtn"
                                            onClick={() =>
                                                removeVariation(
                                                    index
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                )}

                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}