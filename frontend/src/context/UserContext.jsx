import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const URL = import.meta.env.VITE_SERVER_URL;

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const navigate = useNavigate(); // Usa useNavigate correctamente

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null // Maneja el caso null
    );
    const [token, setToken] = useState(
        JSON.parse(localStorage.getItem("token")) || null // Maneja el caso null
    );

    useEffect(() => {
        
        user? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user");
        token? localStorage.setItem("token", JSON.stringify(token)): localStorage.removeItem("token");
    }, [user, token]);

    async function login(data) {
        try {
            const response = await axios.post(`${URL}/login`, {
                email: data.email,
                password: data.password
            });
            console.log(response);
            Swal.fire({
                title: 'Login Successful',
                text: 'You have successfully logged in!',
                icon: 'success',
                timer: 1500, // Corrige el typo
                confirmButtonText: 'OK'
            }).then(() => {
                navigate("/"); // Usa navigate para redirigir
            });

            setUser(response.data.user);
            setToken(response.data.token);
        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            
            Swal.fire({
                title: 'Login Failed',
                text: `There was an error logging in: ${errorMessage}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
       
        
        navigate("/");
    }

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
