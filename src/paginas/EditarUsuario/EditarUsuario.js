import style from './EditarUsuario.module.css';
import { MdEmail, MdLock, MdOutlineSupervisedUserCircle } from "react-icons/md";
import { useState, useEffect } from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { FaRegUser, FaWeightScale } from "react-icons/fa6";
import { GiBodyHeight } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import UsuarioAPI from '../../services/usuarioAPI';
import { useNavigate } from "react-router-dom";
import Topbar from '../../componentes/Topbar/Topbar';
import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import { toast } from 'react-toastify';

export function EditarUsuario() {

    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [tiposGeneros, setTiposGeneros] = useState([]);
    const usuarioToken = GetUsuarioToken();
    const [usuario, setUsuario] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const id = usuarioToken.usuarioId;
    const [emailError, setEmailError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);

    const navigate = useNavigate();

    async function fetchUsuario(usuarioToken) {
        try {
            const response = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setUsuario(response);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

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
            const resp = await UsuarioAPI.obterPorEmailAsync(email);
            return resp && resp.id !== usuario.id;
        } catch {
            return false;
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleEmailBlur = async (e) => {
        const valor = e.target.value;
        if (!valor) return;
        const exists = await checkEmailExists(valor);
        setEmailError(exists
            ? 'Este e‑mail já está em uso por outro usuário.'
            : ''
        );
    };

    useEffect(() => {
        if (emailError) setEmailError('');
    }, [usuario?.email]);

    useEffect(() => {
        fetchUsuario(usuarioToken);
        fetchTiposUsuarios();
        fetchTiposGeneros();
    }, []);


    const calcularIMC = (peso, altura) => {
        if (!peso || !altura) return null;
        const imc = peso / (altura * altura);
        const imcFormatado = imc.toFixed(2);

        let classificacao = "";

        if (imc < 18.5) classificacao = "Abaixo do peso";
        else if (imc < 24.9) classificacao = "Peso normal";
        else if (imc < 29.9) classificacao = "Sobrepeso";
        else if (imc < 34.9) classificacao = "Obesidade grau 1";
        else if (imc < 39.9) classificacao = "Obesidade grau 2";
        else classificacao = "Obesidade grau 3";

        return { imc: imcFormatado, classificacao };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) return;
        try {
            await UsuarioAPI.atualizarAsync(
                usuario.id,
                usuario.nome,
                usuario.email,
                parseFloat(usuario.altura),
                parseFloat(usuario.peso),
                usuario.dataNascimento,
                parseInt(usuario.genero),
                parseInt(usuario.tipoUsuario)
            );
            setModoEdicao(false);
            toast.success("Informações atualizadas com sucesso!");
            navigate("/dashboard");
        } catch (error) {
            console.error('Erro ao atualizar usuário: ', error);
            toast.error("Erro ao salvar as alterações!");
        }

    };

    const renderCampos = (modoEdicao) => (
        <>
            <label className={style.label}>Nome</label>
            <div className={style.inputContainer}>
                <FaRegUser className={style.inputIcon} />
                <input
                    type='text'
                    name='nome'
                    placeholder='seu nome'
                    minLength={3}
                    maxLength={100}
                    className={style.input}
                    value={usuario.nome}
                    onChange={modoEdicao ? handleChange : undefined}
                    readOnly={!modoEdicao}
                />
            </div>
            <label className={style.label}>Email</label>
            <div className={style.inputContainer}>
                <MdEmail className={style.inputIcon} />
                <input
                    type='email'
                    name='email'
                    placeholder='seu@email.com'
                    className={`${style.input} ${emailError ? style.error : ''}`}
                    value={usuario.email}
                    onChange={modoEdicao ? handleChange : undefined}
                    onBlur={modoEdicao ? handleEmailBlur : undefined}
                    readOnly={!modoEdicao}
                />
                {checkingEmail && (
                    <div className={style.errorMessage}>
                        <AiOutlineWarning /> Verificando e‑mail…
                    </div>
                )}
                {emailError && (
                    <div className={style.errorMessage}>
                        <AiOutlineWarning /> {emailError}
                    </div>
                )}
            </div>
            <label className={style.label}>Altura</label>
            <div className={style.inputContainer}>
                <GiBodyHeight className={style.inputIcon} />
                <input
                    type='number'
                    name='altura'
                    step="0.01"
                    placeholder='sua altura'
                    className={`${style.input} ${emailError ? style.error : ''}`}
                    value={usuario.altura}
                    onChange={modoEdicao ? handleChange : undefined}
                    readOnly={!modoEdicao}
                />
            </div>
            <label className={style.label}>Peso</label>
            <div className={style.inputContainer}>
                <FaWeightScale className={style.inputIcon} />
                <input
                    type='number'
                    name='peso'
                    step="0.01"
                    placeholder='seu peso'
                    className={style.input}
                    value={usuario.peso}
                    onChange={modoEdicao ? handleChange : undefined}
                    readOnly={!modoEdicao}
                />
            </div>
            {usuario.peso && usuario.altura && (() => {
                const { imc, classificacao } = calcularIMC(usuario.peso, usuario.altura);
                return (
                    <div className={style.imcBox}>
                        <strong>IMC:</strong> {imc} – <span>{classificacao}</span>
                    </div>
                );
            })()}
            <label className={style.label}>Data nascimento</label>
            <div className={style.inputContainer}>
                <LiaBirthdayCakeSolid className={style.inputIcon} />
                <input
                    type='date'
                    name='dataNascimento'
                    className={style.input}
                    value={usuario.dataNascimento?.split("T")[0]}
                    onChange={modoEdicao ? handleChange : undefined}
                    readOnly={!modoEdicao}
                />
            </div>
            <label className={style.label}>Gênero</label>
            <div className={style.inputContainer}>
                <MdOutlineSupervisedUserCircle className={style.inputIcon} />
                <select
                    className={style.input}
                    name="genero"
                    value={usuario.genero}
                    onChange={modoEdicao ? handleChange : undefined}
                    disabled={!modoEdicao}
                >
                    {tiposGeneros.map((tipo, index) =>
                        typeof tipo === "string" ? (
                            <option key={index} value={index}>{tipo}</option>
                        ) : (
                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                        )
                    )}
                </select>
            </div>
            <label className={style.label}>Tipo usuário</label>
            <div className={style.inputContainer}>
                <FaRegUser className={style.inputIcon} />
                <select
                    className={style.input}
                    name="tipoUsuario"
                    value={usuario.tipoUsuario}
                    onChange={modoEdicao ? handleChange : undefined}
                    disabled={!modoEdicao}
                >
                    {tiposUsuarios.map((tipo, index) =>
                        typeof tipo === "string" ? (
                            <option key={index} value={index}>{tipo}</option>
                        ) : (
                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                        )
                    )}
                </select>
            </div>
        </>
    );


    if (!usuario) return <p>Carregando...</p>;

    return (
        <Topbar>
            <div className={style.conteudo}>
                <div className={style.card_container}>
                    <h4>Perfil do Usuário</h4>
                    {modoEdicao ? (
                        <form onSubmit={handleSubmit} className={style.formContainer}>
                            {renderCampos(true)}
                            <div style={{ marginTop: "2rem" }}>
                                <button
                                    type="submit"
                                    className={style.btnEditar}
                                    disabled={!!emailError || checkingEmail}
                                >
                                    Salvar alterações
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={style.formContainer}>
                            {renderCampos(false)}
                            <div style={{ marginTop: "2rem" }}>
                                <button type="button" className={style.btnEditar} onClick={() => setModoEdicao(true)}>Editar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Topbar>
    );
};

export default EditarUsuario;