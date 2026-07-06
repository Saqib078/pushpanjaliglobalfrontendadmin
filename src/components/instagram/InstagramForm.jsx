import { useEffect, useState } from "react";

const initialState = {
    reel_url: "",
    is_active: true,
};

const InstagramForm = ({
    mode = "create",
    initialData = null,
    loading = false,
    onSubmit,
}) => {

    const [formData, setFormData] = useState(initialState);

    const [video, setVideo] = useState(null);

    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (mode === "edit" && initialData) {

            setFormData({
                reel_url: initialData.reel_url || "",
                is_active: initialData.is_active,
            });

            setPreview(initialData.video_url);

        }

    }, [mode, initialData]);

    const handleSubmit = (e) => {

        e.preventDefault();

        const payload = new FormData();

        payload.append(
            "reel_url",
            formData.reel_url
        );

        payload.append(
            "is_active",
            formData.is_active
        );

        if (video) {

            payload.append(
                "video",
                video
            );

        }

        onSubmit(payload);
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-8 space-y-8"
        >

            <h1 className="text-2xl font-semibold">

                {mode === "create"
                    ? "Add Instagram Reel"
                    : "Edit Instagram Reel"}

            </h1>

            {/* Reel URL */}

            <div>

                <label className="block mb-2 font-medium">

                    Instagram Reel URL

                </label>

                <input

                    type="url"

                    value={formData.reel_url}

                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            reel_url: e.target.value,
                        }))
                    }

                    className="
                        w-full
                        border
                        rounded-lg
                        px-4
                        py-3
                    "

                    placeholder="https://www.instagram.com/reel/..."

                    required

                />

            </div>

            {/* Upload */}

            <div>

                <label className="block mb-2 font-medium">

                    Reel Video

                </label>

                <input

                    type="file"

                    accept="video/*"

                    onChange={(e) => {

                        const file = e.target.files[0];

                        if (!file) return;

                        setVideo(file);

                        setPreview(
                            URL.createObjectURL(file)
                        );

                    }}

                />

            </div>

            {/* Preview */}

            {preview && (

                <div>

                    <video

                        src={preview}

                        controls

                        className="
                            w-full
                            max-w-sm
                            rounded-lg
                            border
                        "

                    />

                </div>

            )}

            {/* Status */}

            <div>

                <label className="block mb-3 font-medium">

                    Status

                </label>

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"

                        checked={formData.is_active}

                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                            }))
                        }

                    />

                    Active

                </label>

            </div>

            {/* Button */}

            <div className="flex justify-end">

                <button

                    type="submit"

                    disabled={loading}

                    className={`
                        px-8
                        py-3
                        rounded-lg
                        text-white

                        ${loading
                            ? "bg-gray-400"
                            : "bg-black"
                        }
                    `}

                >

                    {loading
                        ? "Saving..."
                        : mode === "create"
                            ? "Create Reel"
                            : "Update Reel"}

                </button>

            </div>

        </form>

    );

};

export default InstagramForm;