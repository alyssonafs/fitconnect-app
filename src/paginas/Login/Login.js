import style from "./Login.module.css";
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../../services/authAPI';
import { MdEmail, MdLock } from "react-icons/md";
import { jwtDecode } from 'jwt-decode';

export function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.loginAsync(email, senha);
            setErro('');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setErro('E-mail ou senha inválidos');
        }

    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { exp } = jwtDecode(token);
                if (Date.now() < exp * 1000) {
                    navigate('/dashboard', { replace: true });
                }
            } catch {
                
            }
        }
    }, [navigate]);

    return (
        <div className={style.conteudo}>
            <div className={style.login_container}>
                <div className={style.header}>
                    <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
                </div>
                <form onSubmit={handleSubmit} className={style.formContainer}>
                    <label className={style.label}>Email</label>
                    <div className={style.inputContainer}>
                        <MdEmail className={style.inputIcon} />
                        <input type='email' placeholder='seu@email.com' required className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <label className={style.label}>Senha</label>
                    <div className={style.inputContainer}>
                        <MdLock className={style.inputIcon} />
                        <input type='password' placeholder='••••••••' required className={style.input} value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </div>
                    <button type="submit" class={style.btnEntrar}>Entrar</button>
                    {erro && <p className={style.erro_login} style={{ color: 'red' }}>{erro}</p>}
                    <div className={style.links}>
                        <a href="/novo-usuario" className={style.linkCadastrar}>Cadastre-se</a>
                        <a href="/solicitar-recuperacao" className={style.linkSenha}>esqueci minha senha</a>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Login;