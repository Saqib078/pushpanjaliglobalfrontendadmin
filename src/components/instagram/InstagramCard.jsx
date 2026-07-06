import { useNavigate } from "react-router-dom";
import { authApi } from "../../lib/authapi";

const InstagramCard = ({ reel, onDelete }) => {

    const navigate = useNavigate();

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this reel?"
        );

        if (!confirmDelete) return;

        try {

            await authApi.deleteInstagramReel(
                reel._id
            );

            onDelete();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">

            {/* Video */}

            <video

                src={`https://pushpanjaliglobal.com${reel.video_url}`}

                controls

                preload="metadata"

                className="w-full h-[320px] object-cover"

            />

            {/* Body */}

            <div className="p-5 space-y-4">

                {/* Link */}

                <div>

                    <p className="text-sm font-medium mb-1">

                        Instagram Link

                    </p>

                    <a

                        href={reel.reel_url}

                        target="_blank"

                        rel="noreferrer"

                        className="
                            text-blue-600
                            break-all
                            hover:underline
                        "

                    >

                        {reel.reel_url}

                    </a>

                </div>

                {/* Status */}

                <div>

                    <span

                        className={`

                        inline-flex

                        px-3

                        py-1

                        rounded-full

                        text-sm

                        font-medium

                        ${reel.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }

                        `}

                    >

                        {reel.is_active
                            ? "Active"
                            : "Inactive"}

                    </span>

                </div>

                {/* Buttons */}

                <div className="flex gap-3">

                    <button

                        onClick={() =>
                            navigate(
                                `/admin/instagram/edit/${reel._id}`
                            )
                        }

                        className="
                            flex-1
                            bg-black
                            text-white
                            py-2
                            rounded-lg
                        "

                    >

                        Edit

                    </button>

                    <button

                        onClick={handleDelete}

                        className="
                            flex-1
                            bg-red-600
                            text-white
                            py-2
                            rounded-lg
                        "

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

};

export default InstagramCard;