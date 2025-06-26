import { Topbar } from '../../componentes/Topbar/Topbar';
import style from './Dashboard.module.css';

export function Dashboard() {
    return(
        <div className={style.conteudo}>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Dashboard</h3>
                </div>
            </Topbar>
        </div>
    )
}