import style from './Topbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import authAPI from "../../services/authAPI";
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import GetUsuarioToken from '../JwtDecode/GetUsuarioToken';
import { useState } from 'react';
import { FaRegUser } from "react-icons/fa6";


export function Topbar({ children }) {

    const navigate = useNavigate();

    const usuario = GetUsuarioToken();

    const usuarioNome = usuario?.nome;

    const usuarioIniciais = (usuarioNome) => {
        const nomeSemAcento = usuarioNome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return nomeSemAcento.substring(0, 2).toUpperCase();
    }

    const [mostrarMenu, setMostrarMenu] = useState(false);

    function toggleMenu() {
        setMostrarMenu(!mostrarMenu);
    }
    
    const handleLogout = async (e) => {
        e.preventDefault();
        authAPI.logoutAsync();
        navigate('/');
    }

    return (
        <div>
            <div className={style.topbar_conteudo}>
                <div className={style.conteudo_logo}>
                    <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
                </div>
                <div className={style.topbar_acoes}>
                    <div className={style.usuario_info} onClick={toggleMenu}>
                        <div className={style.avatar}>
                            <p>{usuarioIniciais(usuarioNome)}</p>
                        </div>
                        <div className={style.usuario_detalhes}>
                            <p className={style.usuario_nome}>{usuarioNome}</p>
                        </div>
                        {mostrarMenu && (
                            <div className={style.menu_dropdown}>
                                <Link to="/usuario"><FaRegUser className={style.inputIcon} /> Visualizar Perfil</Link>
                            </div>
                        )}
                    </div>
                    <Link onClick={handleLogout} className={style.botao_deslogar}><MdLogout /></Link>
                </div>
            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    )
}

export default Topbar;