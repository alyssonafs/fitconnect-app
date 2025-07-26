import { Link } from 'react-router-dom';
import style from './PaginaNaoEncontrada.module.css';
import LogoFitConnect from "./../../assets/LogoSemFundo.png";

export function PaginaNaoEncontrada() {
    return (
        <div className={style.container}>
            <div className={style.pagina404}>
                <div className={style.header}>
                    <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
                </div>
                <h1>404 - Página não encontrada</h1>
                <p>A página que você está tentando acessar não existe ou foi removida.</p>
                <Link to="/" className={style.link}>Voltar para a página inicial</Link>
            </div>
        </div >
    );
}
