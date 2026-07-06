import { useEffect, useState } from "react";
import FaqSection from "./FaqSection";
import StorageSection from "./StorageSection";

const initialState = {
    health_benefits: [],
    how_to_use: [],
    ingredients: {
        ingredients: "",
        sourcing: "",
    },
    storage: {
        instructions: [],
        shelf_life: "",
    },
    faqs: [],
};

const ProductInformationForm = ({
    mode = "create",
    initialData = null,
    onSubmit,
    loading = false,
}) => {

    const [formData, setFormData] = useState(initialState);

    const [healthBenefit, setHealthBenefit] = useState("");
    const [howToUse, setHowToUse] = useState("");

    useEffect(() => {

        if (mode === "edit" && initialData) {
            setFormData(initialData);
        }

    }, [mode, initialData]);

    /* ------------------------- Health Benefits ------------------------- */

    const addHealthBenefit = () => {

        if (!healthBenefit.trim()) return;

        setFormData((prev) => ({
            ...prev,
            health_benefits: [
                ...prev.health_benefits,
                healthBenefit.trim(),
            ],
        }));

        setHealthBenefit("");
    };

    const removeHealthBenefit = (index) => {

        setFormData((prev) => ({
            ...prev,
            health_benefits: prev.health_benefits.filter(
                (_, i) => i !== index
            ),
        }));
    };

    /* ---------------------------- How To Use ---------------------------- */

    const addHowToUse = () => {

        if (!howToUse.trim()) return;

        setFormData((prev) => ({
            ...prev,
            how_to_use: [
                ...prev.how_to_use,
                howToUse.trim(),
            ],
        }));

        setHowToUse("");
    };

    const removeHowToUse = (index) => {

        setFormData((prev) => ({
            ...prev,
            how_to_use: prev.how_to_use.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-10"
        >

            {/* ================= Health Benefits ================= */}

            <div className="space-y-4">

                <h2 className="text-xl font-semibold">
                    Health Benefits
                </h2>

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={healthBenefit}
                        onChange={(e) =>
                            setHealthBenefit(e.target.value)
                        }
                        placeholder="Enter health benefit"
                        className="border rounded-lg px-4 py-2 flex-1"
                    />

                    <button
                        type="button"
                        onClick={addHealthBenefit}
                        className="bg-green-600 text-white px-5 rounded-lg"
                    >
                        Add
                    </button>

                </div>

                <div className="space-y-2">

                    {formData.health_benefits.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="flex justify-between items-center border rounded-lg px-4 py-3"
                            >

                                <p>{item}</p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeHealthBenefit(index)
                                    }
                                    className="text-red-600"
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>

            </div>

            {/* ================= How To Use ================= */}

            <div className="space-y-4">

                <h2 className="text-xl font-semibold">
                    How To Use
                </h2>

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={howToUse}
                        onChange={(e) =>
                            setHowToUse(e.target.value)
                        }
                        placeholder="Enter instruction"
                        className="border rounded-lg px-4 py-2 flex-1"
                    />

                    <button
                        type="button"
                        onClick={addHowToUse}
                        className="bg-green-600 text-white px-5 rounded-lg"
                    >
                        Add
                    </button>

                </div>

                <div className="space-y-2">

                    {formData.how_to_use.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="flex justify-between items-center border rounded-lg px-4 py-3"
                            >

                                <p>{item}</p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeHowToUse(index)
                                    }
                                    className="text-red-600"
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>

            </div>
                        {/* ================= Ingredients ================= */}

            <div className="space-y-4">

                <h2 className="text-xl font-semibold">
                    Ingredients
                </h2>

                <div className="space-y-4">

                    <textarea
                        rows={4}
                        placeholder="Ingredients"
                        value={formData.ingredients.ingredients}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                ingredients: {
                                    ...prev.ingredients,
                                    ingredients: e.target.value,
                                },
                            }))
                        }
                        className="border rounded-lg p-3 w-full"
                    />

                    <textarea
                        rows={5}
                        placeholder="Sourcing"
                        value={formData.ingredients.sourcing}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                ingredients: {
                                    ...prev.ingredients,
                                    sourcing: e.target.value,
                                },
                            }))
                        }
                        className="border rounded-lg p-3 w-full"
                    />

                </div>

            </div>

            {/* ================= Storage ================= */}

            <StorageSection
                formData={formData}
                setFormData={setFormData}
            />

            {/* ================= FAQs ================= */}

            <FaqSection
                formData={formData}
                setFormData={setFormData}
            />

            {/* ================= Submit ================= */}

            <div className="flex justify-end">

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg"
                >
                    {loading
                        ? "Saving..."
                        : mode === "create"
                        ? "Create Information"
                        : "Update Information"}
                </button>

            </div>

        </form>
    );
};

export default ProductInformationForm;