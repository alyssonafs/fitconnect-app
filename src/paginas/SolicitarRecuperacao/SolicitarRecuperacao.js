import { useState } from 'react';
import style from './SolicitarRecuperacao.module.css';
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import authAPI from '../../services/authAPI';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";

const SolicitarRecuperacao = () => {

    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.solicitarRecuperacao(email);
            setErro('');
            navigate('/redefinir-senha', { state: { email } });
        } catch (error) {
            console.error(error);
            setErro('Caso seu e-mail esteja cadastrado, será enviado um código para recuperação de senha.');
        }

    };

    return (
        <div className={style.conteudo}>
            <div className={style.card_container}>
                <div className={style.header}>
                    <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
                </div>
                <form onSubmit={handleSubmit} className={style.formContainer}>
                    <label className={style.label}>Email</label>
                    <div className={style.inputContainer}>
                        <MdEmail className={style.inputIcon} />
                        <input type='email' placeholder='seu@email.com' required className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" class={style.btnEnviar}>Enviar</button>
                    {erro && <p className={style.erro_login} style={{ color: 'red' }}>{erro}</p>}
                </form>
            </div>
        </div>
    )
}

export default SolicitarRecuperacao;