import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { authApi } from "../lib/authapi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmin();
    }, []);

    const sendOtp = async (email) => {

        const data = await authApi.sendlogin(email);

        return data;
    };

    const verifyOtp = async (otp_id, otp) => {
        const data = await authApi.verifyOtp(otp_id, otp);
        await fetchAdmin();
        return data;
    };

    const fetchAdmin = async () => {
        try {
            const data = await authApi.me();
            setAdmin(data.admin);
        } catch (err) {
            console.error(err);
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error(err);
        } finally {
            setAdmin(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                setAdmin,
                loading,
                setLoading,
                sendOtp,
                verifyOtp,
                fetchAdmin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);