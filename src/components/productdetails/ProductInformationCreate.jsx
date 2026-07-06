import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductInformationForm from "./ProductInformationForm";
import { authApi } from "../../lib/authapi";


const ProductInformationCreate = () => {

    const navigate = useNavigate();

    const { productId } = useParams();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            await authApi.createProductInformation({

                product_id: productId,

                ...formData,

            });

            navigate(`/admin/product/${productId}`);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <ProductInformationForm

            mode="create"

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default ProductInformationCreate;