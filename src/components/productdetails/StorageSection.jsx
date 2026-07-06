import { useState } from "react";

const StorageSection = ({ formData, setFormData }) => {

    const [instruction, setInstruction] = useState("");

    const addInstruction = () => {

        if (!instruction.trim()) return;

        setFormData((prev) => ({
            ...prev,
            storage: {
                ...prev.storage,
                instructions: [
                    ...prev.storage.instructions,
                    instruction.trim(),
                ],
            },
        }));

        setInstruction("");
    };

    const removeInstruction = (index) => {

        setFormData((prev) => ({
            ...prev,
            storage: {
                ...prev.storage,
                instructions:
                    prev.storage.instructions.filter(
                        (_, i) => i !== index
                    ),
            },
        }));
    };

    return (

        <div className="space-y-5">

            <h2 className="text-xl font-semibold">
                Storage & Shelf Life
            </h2>

            <div className="flex gap-3">

                <input
                    type="text"
                    value={instruction}
                    onChange={(e) =>
                        setInstruction(e.target.value)
                    }
                    placeholder="Storage Instruction"
                    className="border rounded-lg px-4 py-2 flex-1"
                />

                <button
                    type="button"
                    onClick={addInstruction}
                    className="bg-green-600 text-white px-5 rounded-lg"
                >
                    Add
                </button>

            </div>

            <div className="space-y-2">

                {formData.storage.instructions.map(
                    (item, index) => (

                        <div
                            key={index}
                            className="flex justify-between items-center border rounded-lg px-4 py-3"
                        >

                            <p>{item}</p>

                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() =>
                                    removeInstruction(index)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    )
                )}

            </div>

            <div>

                <label className="font-medium block mb-2">
                    Shelf Life
                </label>

                <input
                    type="text"
                    placeholder="12 Months"
                    value={formData.storage.shelf_life}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            storage: {
                                ...prev.storage,
                                shelf_life: e.target.value,
                            },
                        }))
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

            </div>

        </div>
    );
};

export default StorageSection;