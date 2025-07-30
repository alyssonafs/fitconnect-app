import style from './NovoUsuario.module.css';
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import { MdEmail, MdLock, MdOutlineSupervisedUserCircle } from "react-icons/md";
import { useState, useEffect } from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { FaRegUser, FaWeightScale } from "react-icons/fa6";
import { GiBodyHeight } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import UsuarioAPI from '../../services/usuarioAPI';
import { useNavigate } from "react-router-dom";

export function NovoUsuario() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [tipoGenero, setTipoGenero] = useState('');
    const [tiposGeneros, setTiposGeneros] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);

    const navigate = useNavigate();

    const fetchTiposGeneros = async () => {
        try {
            const tiposGeneros = await UsuarioAPI.listarTiposGeneroAsync();
            setTiposGeneros(tiposGeneros);
        } catch (error) {
            console.error('Erro ao buscar tipos de gêneros: ', error);
        }
    };

    const fetchTiposUsuarios = async () => {
        try {
            const tiposUsuarios = await UsuarioAPI.listarTiposUsuarioAsync();
            setTiposUsuarios(tiposUsuarios);
        } catch (error) {
            console.error('Erro ao buscar tipos de usuários: ', error);
        }
    };

    const checkEmailExists = async (email) => {
        setCheckingEmail(true);
        try {
            const user = await UsuarioAPI.obterPorEmailAsync(email);
            return !!user;
        } catch (error) {
            console.error('Erro ao verificar e‑mail:', error);
            return false;
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleEmailBlur = async () => {
        if (!email) return;
        const exists = await checkEmailExists(email);
        if (exists) {
            setEmailError('Este e‑mail está indisponível.');
        }
    };

    useEffect(() => {
        if (emailError) {
            setEmailError('');
        }
    }, [email]);

    useEffect(() => {
        fetchTiposUsuarios();
        fetchTiposGeneros();
    }, []);




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) return;
        try {
            const tipoGeneroId = parseInt(tipoGenero);
            const tipoUsuarioId = parseInt(tipoUsuario);
            await UsuarioAPI.criarAsync(nome, email, senha, altura, peso, dataNascimento, tipoGeneroId, tipoUsuarioId);
            navigate('/');
        } catch (error) {
            console.error('Erro ao cadastrar usuário: ', error);
        }

    };

    return (
        <div className={style.conteudo}>
            <div className={style.card_container}>
                <div className={style.header}>
                    <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
                </div>
                <h3>Novo Usuário</h3>
                <form onSubmit={handleSubmit} className={style.formContainer}>
                    <label className={style.label}>Nome</label>
                    <div className={style.inputContainer}>
                        <FaRegUser className={style.inputIcon} />
                        <input type='text' placeholder='seu nome' minLength={3} maxLength={100} required className={style.input} value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <label className={style.label}>Email</label>
                    <div className={style.inputContainer}>
                        <MdEmail className={style.inputIcon} />
                        <input type='email' placeholder='seu@email.com' required className={`${style.input} ${emailError ? style.error : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
                        {checkingEmail && (
                            <div className={style.errorMessage}>
                                <AiOutlineWarning /> Verificando e‑mail…
                            </div>
                        )
                        }
                        {emailError && (
                            <div className={style.errorMessage}>
                                <AiOutlineWarning /> {emailError}
                            </div>
                        )
                        }
                    </div>
                    <label className={style.label}>Senha</label>
                    <div className={style.inputContainer}>
                        <MdLock className={style.inputIcon} />
                        <input type='password' placeholder='••••••••' required className={style.input} value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </div>
                    <label className={style.label}>Altura</label>
                    <div className={style.inputContainer}>
                        <GiBodyHeight className={style.inputIcon} />
                        <input type='number' step="0.01" placeholder='sua altura' required className={style.input} value={altura} onChange={(e) => setAltura(e.target.value)} />
                    </div>
                    <label className={style.label}>Peso</label>
                    <div className={style.inputContainer}>
                        <FaWeightScale className={style.inputIcon} />
                        <input type='number' step="0.01" placeholder='seu peso' required className={style.input} value={peso} onChange={(e) => setPeso(e.target.value)} />
                    </div>
                    <label className={style.label}>Data nascimento</label>
                    <div className={style.inputContainer}>
                        <LiaBirthdayCakeSolid className={style.inputIcon} />
                        <input type='date' placeholder='sua data de nascimento' required className={style.input} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                    </div>
                    <label className={style.label}>Gênero</label>
                    <div className={style.inputContainer}>
                        <MdOutlineSupervisedUserCircle className={style.inputIcon} />
                        <select
                            required
                            className={style.input}
                            value={tipoGenero}
                            onChange={(e) => setTipoGenero(e.target.value)}
                        >
                            <option value="">Selecione seu gênero</option>
                            {tiposGeneros.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <label className={style.label}>Tipo usuário</label>
                    <div className={style.inputContainer}>
                        <FaRegUser className={style.inputIcon} />
                        <select
                            required
                            className={style.input}
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                        >
                            <option value="">Selecione o tipo de usuário</option>
                            {tiposUsuarios.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" class={style.btnCadastrar} disabled={!!emailError || checkingEmail}>Cadastrar-se</button>
                </form>
            </div>
        </div>
    );
};

export default NovoUsuario;