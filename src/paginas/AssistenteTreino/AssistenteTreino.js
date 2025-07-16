import style from './AssistenteTreino.module.css';
import { useState, useEffect } from 'react';
import Topbar from '../../componentes/Topbar/Topbar';
import ExercicioAPI from '../../services/exercicioAPI';
import TreinoAPI from '../../services/treinoAPI';
import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import UsuarioAPI from '../../services/usuarioAPI';

const objetivos = ["Hipertrofia", "Definição", "Resistência"];

export function AssistenteTreino() {
    const usuarioToken = GetUsuarioToken();
    const [usuario, setUsuario] = useState(null);
    const [usuariosAlunos, setUsuariosAlunos] = useState([]);
    const [usuarioAlvoId, setUsuarioAlvoId] = useState(usuarioToken.usuarioId);
    const [gruposMusculares, setGruposMusculares] = useState([]);
    const [gruposSelecionados, setGruposSelecionados] = useState([]);
    const [objetivo, setObjetivo] = useState('');
    const [mensagem, setMensagem] = useState('');

    async function fetchUsuario(usuarioToken) {
        try {
            const response = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setUsuario(response);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

    async function fetchGruposMusculares() {
        try {
            const grupos = await ExercicioAPI.listarTiposGruposMuscularesAsync();
            setGruposMusculares(grupos);
        } catch (error) {
            alert("Erro ao buscar grupos musculares!");
        }
    }

    async function fetchUsuariosAlunos() {
        try {
            const lista = await UsuarioAPI.listarUsuariosAsync();
            setUsuariosAlunos(lista);
        } catch (error) {
            alert("Erro ao buscar alunos!");
        }
    }

    useEffect(() => {
        if (usuarioToken) {
            fetchUsuario(usuarioToken);
        }
    }, []);

    useEffect(() => {
        if (!usuario) return;

        fetchGruposMusculares();

        if (usuario.tipoUsuario === 0) {
            fetchUsuariosAlunos();
        }
    }, [usuario]);

    const toggleGrupo = (value) => {
        setGruposSelecionados(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        if (!objetivo || gruposSelecionados.length === 0) {
            setMensagem("Selecione pelo menos um grupo muscular e um objetivo.");
            return;
        }

        try {
            await TreinoAPI.gerarTreinoIaAsync(usuario.Id, usuarioAlvoId, gruposSelecionados, objetivo);
            setMensagem("✅ Treino gerado com sucesso!");
        } catch (error) {
            console.error(error);
            setMensagem("❌ Erro ao gerar treino. Tente novamente.");
        }
    };

    if (!usuario) {
        return <div>Carregando usuário...</div>;
    }

    return (
        <Topbar>
            <div className={style.conteudo}>
                <div className={style.card_container}>
                    <h2>Assistente de Treino</h2>

                    {usuario.tipoUsuario === 0 && (
                        <>
                            <label className={style.label}>Selecionar aluno</label>
                            <select
                                className={style.input}
                                value={usuarioAlvoId}
                                onChange={(e) => setUsuarioAlvoId(parseInt(e.target.value))}
                            >
                                <option value="">Selecione um aluno</option>
                                {usuariosAlunos.map(aluno => (
                                    <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                                ))}
                            </select>
                        </>
                    )}

                    <label className={style.label}>Grupos Musculares:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {gruposMusculares.map(grupo => (
                            <button
                                key={grupo.id}
                                onClick={() => toggleGrupo(grupo.id)}
                                className={`${style.grupoBtn} ${gruposSelecionados.includes(grupo.id) ? style.grupoBtnSelecionado : ''}`}
                            >
                                {grupo.nome}
                            </button>
                        ))}
                    </div>


                    <label className={style.label}>Objetivo:</label>
                    <select
                        className={style.input}
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {objetivos.map(obj => (
                            <option key={obj} value={obj}>{obj}</option>
                        ))}
                    </select>

                    <button className={style.btnForm} onClick={handleSubmit}>
                        Gerar Treino com IA
                    </button>

                    {mensagem && <p style={{ marginTop: '1rem' }}>{mensagem}</p>}
                </div>
            </div>
        </Topbar>
    );
}
