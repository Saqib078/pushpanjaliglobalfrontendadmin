import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductInformationForm from "./ProductInformationForm";
import { authApi } from "../../lib/authapi";

const ProductInformationEdit = () => {

    const navigate = useNavigate();

    const { productId } = useParams();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {

        if (productId) {
            getProductInformation();
        }

    }, [productId]);

    const getProductInformation = async () => {

        try {

            setLoading(true);

            const response =
                await authApi.getProductInformation(productId);

            setInitialData(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    const handleSubmit = async (formData) => {

        try {

            setSaving(true);

            await authApi.updateProductInformation(
                productId,
                formData
            );

            navigate(
                `/admin/product/${productId}`
            );

        } catch (error) {

            console.error(error);

        } finally {

            setSaving(false);

        }
    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-[400px]">

                Loading...

            </div>

        );
    }

    return (

        <ProductInformationForm

            mode="edit"

            initialData={initialData}

            loading={saving}

            onSubmit={handleSubmit}

        />

    );
};

export default ProductInformationEdit;