import Header from '../../layout/header/Header';
import './Login.css';
import { useForm } from 'react-hook-form';
import { useUser } from "../../context/UserContext";
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

const URL = import.meta.env.VITE_SERVER_URL;

export default function Login() {
    const { login } = useUser();
    console.log(URL);
    const { register, handleSubmit } = useForm();

    async function onLogin(data) {
        login(data);
    }

    return (
        <>
            <Header />
            <div className="main-container">
                <div className="login-container">
                    <form className="login-form" onSubmit={handleSubmit(onLogin)}>
                        <h1>LOGIN</h1>
                        <input
                            {...register("email", { required: true })}
                            type="text"
                            placeholder="EMAIL"
                        />
                        <input
                            {...register("password", { required: true, maxLength: 20 })}
                            type="password"
                            placeholder="CONTRASEÑA"
                        />
                        <button type="submit" className="button">
                            INGRESAR
                        </button>

                        {/* Enlace para crear una cuenta */}
                        <p className="register-link">
                        <Link to="/register">CREAR UNA CUENTA</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
