import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../../lib/authapi";
import InstagramCard from "./InstagramCard";

const Instagram = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [reels, setReels] = useState([]);

    useEffect(() => {

        getInstagramReels();

    }, []);

    const getInstagramReels = async () => {

        try {

            setLoading(true);

            const response =
                await authApi.getInstagramReels();

            setReels(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="space-y-8">

            <div className="flex justify-between items-center">

                <h1 className="text-2xl font-semibold">

                    Instagram Reels

                </h1>

                <button
                    onClick={() =>
                        navigate("/admin/instagram/create")
                    }
                    className="bg-black text-white px-6 py-3 rounded-lg"
                >
                    Add New Reel
                </button>

            </div>

            {/* Loading */}

            {loading && (

                <div className="bg-white rounded-lg p-20 text-center">

                    Loading...

                </div>

            )}

            {/* Empty */}

            {!loading && reels.length === 0 && (

                <div className="bg-white rounded-lg p-20 text-center">

                    <h2 className="text-xl font-semibold">

                        No Instagram Reels

                    </h2>

                    <p className="mt-3 text-gray-500">

                        Upload your first reel.

                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/instagram/create")
                        }
                        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Add First Reel
                    </button>

                </div>

            )}

            {/* Grid */}

            {!loading && reels.length > 0 && (

                <div
                    className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
            "
                >

                    {reels.map((reel) => (

                        <InstagramCard
                            key={reel._id}
                            reel={reel}
                            onDelete={getInstagramReels}
                        />

                    ))}

                </div>

            )}

        </div>

    );

};

export default Instagram;