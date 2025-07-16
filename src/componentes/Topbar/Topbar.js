import style from './Topbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import authAPI from "../../services/authAPI";
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import GetUsuarioToken from '../JwtDecode/GetUsuarioToken';
import { useState, useEffect, useRef } from 'react';
import UsuarioAPI from '../../services/usuarioAPI';

export function Topbar({ children }) {
    const navigate = useNavigate();
    const usuarioToken = GetUsuarioToken();
    const [nome, setNome] = useState('');
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const menuRef = useRef(null);

    async function fetchUsuarioNome() {
        try {
            const usuario = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setNome(usuario.nome);
        } catch (error) {
            console.error("Erro ao buscar nome do usuário na Topbar", error);
        }
    }

    useEffect(() => {
        fetchUsuarioNome();
    }, []);

    const usuarioIniciais = (usuarioNome) => {
        const nomeSemAcento = usuarioNome.normalize("NFD").replace(/[̀-\u036f]/g, "");
        return nomeSemAcento.substring(0, 2).toUpperCase();
    }

    function toggleMenu() {
        setMostrarMenu(prev => !prev);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMostrarMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef]);

    const handleLogout = async (e) => {
        e.preventDefault();
        await authAPI.logoutAsync();
        navigate('/');
    }

    return (
        <div>
            <div className={style.topbar_conteudo}>
                <div className={style.conteudo_logo}>
                    <Link className={style.link_logo} to="/dashboard">
                        <img src={LogoFitConnect} alt="logo" className={style.logo} />
                    </Link>
                </div>
                <div className={style.topbar_acoes} ref={menuRef}>
                    <div className={style.usuario_info}>
                        <div className={style.avatar} onClick={toggleMenu}>
                            <p>{usuarioIniciais(nome)}</p>
                        </div>
                        <div className={style.usuario_detalhes}>
                            <p
                                className={style.usuario_nome}
                                title={nome}
                            >
                                {nome}
                            </p>
                        </div>
                        {mostrarMenu && (
                            <div className={style.menu_dropdown}>
                                <Link to="/editar-usuario">Visualizar Perfil</Link>
                            </div>
                        )}
                        <Link onClick={handleLogout} className={style.botao_deslogar}>
                            <MdLogout />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}

export default Topbar;
