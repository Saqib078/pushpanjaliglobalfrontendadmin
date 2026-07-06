
import { useEffect, useState } from "react";
import { authApi } from "../../lib/authapi";
import { useNavigate } from "react-router-dom";

const ProductInformationView = ({ productId, onEdit }) => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!productId) return;

        getProductInformation();

    }, [productId]);

    const getProductInformation = async () => {

        try {

            setLoading(true);

            const response =
                await authApi.getProductInformation(productId);

            setData(response.data);

        } catch (error) {

            console.error(error);

            setData(null);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

        return (
            <div className="text-center py-10">
                Loading...
            </div>
        );
    }

    if (!data) {

        return (

            <div className="border rounded-xl p-10 text-center bg-white">

                <h2 className="text-xl font-semibold">
                    Product Information
                </h2>

                <p className="text-gray-500 mt-4">
                    No product information available.
                </p>

                <button
                    onClick={() =>
                        navigate(
                            `/admin/product-information/create/${productId}`
                        )
                    }
                    className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
                >
                    Add Information
                </button>

            </div>

        );
    }

    return (

        <div className="bg-white border-xl rounded p-[25px] space-y-10">

            {/* Health */}

            <div>

                <h2 className="text-xl font-semibold mb-4">
                    Health Benefits
                </h2>

                <ul className="space-y-2">

                    {data.health_benefits.map((item, index) => (

                        <li key={index}>
                            • {item}
                        </li>

                    ))}

                </ul>

            </div>

            {/* How To Use */}

            <div>

                <h2 className="text-xl font-semibold mb-4">
                    How To Use
                </h2>

                <ul className="space-y-2">

                    {data.how_to_use.map((item, index) => (

                        <li key={index}>
                            • {item}
                        </li>

                    ))}

                </ul>

            </div>

            {/* Ingredients */}

            <div>

                <h2 className="text-xl font-semibold mb-4">
                    Ingredients
                </h2>

                <p>
                    {data.ingredients.ingredients}
                </p>

                <p className="mt-4">
                    {data.ingredients.sourcing}
                </p>

            </div>

            {/* Storage */}

            <div>

                <h2 className="text-xl font-semibold mb-4">
                    Storage
                </h2>

                <ul className="space-y-2">

                    {data.storage.instructions.map((item, index) => (

                        <li key={index}>
                            • {item}
                        </li>

                    ))}

                </ul>

                <p className="mt-5">

                    <strong>Shelf Life : </strong>

                    {data.storage.shelf_life}

                </p>

            </div>

            {/* FAQ */}

            <div>

                <h2 className="text-xl font-semibold mb-5">
                    FAQs
                </h2>

                <div className="space-y-6">

                    {data.faqs.map((faq) => (

                        <div
                            key={faq._id}
                            className="border rounded-lg p-5"
                        >

                            <h3 className="font-semibold">

                                Q. {faq.question}

                            </h3>

                            <p className="mt-3">

                                {faq.answer}

                            </p>

                        </div>

                    ))}

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    onClick={onEdit}
                    className="bg-black text-white px-6 py-3 rounded-lg"
                >
                    Edit Information
                </button>

            </div>

        </div>

    );
};

export default ProductInformationView;


