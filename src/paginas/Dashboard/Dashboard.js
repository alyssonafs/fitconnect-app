import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import { Topbar } from '../../componentes/Topbar/Topbar';
import TreinoAPI from '../../services/treinoAPI';
import UsuarioAPI from '../../services/usuarioAPI';
import ExercicioAPI from '../../services/exercicioAPI';
import style from './Dashboard.module.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from 'react-toastify';

export function Dashboard() {

    const usuarioToken = GetUsuarioToken();
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    const [treinos, setTreinos] = useState([]);
    const [carregando, setCarregando] = useState(true)

    const [gruposMusculares, setGruposMusculares] = useState([]);
    const [grupoSelecionado, setGrupoSelecionado] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [treinoSelecionado, setTreinoSelecionado] = useState(null);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState([]);

    async function fetchUsuario(usuarioToken) {
        try {
            const response = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setUsuario(response);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

    async function fetchTreinos() {
        try {
            let todosTreinos = [];

            if (grupoSelecionado) {
                todosTreinos = await TreinoAPI.listarPorGrupoMuscularAsync(parseInt(grupoSelecionado), usuario.id);
            } else {
                const criados = await TreinoAPI.listarTreinosPersonalAsync(usuario.id);
                const treinosIds = await TreinoAPI.listarTreinosAlunoAsync(usuario.id);
                const promises = treinosIds.map(item => TreinoAPI.obterAsync(item.treinoId));
                const compartilhados = await Promise.all(promises);
                todosTreinos = [...criados, ...compartilhados];
            }

            setTreinos(todosTreinos);
        } catch (error) {
            console.error("Erro ao buscar treinos do personal:", error);
        } finally {
            setCarregando(false);
        }
    }

    async function fetchGruposMusculares() {
        try {
            const grupos = await ExercicioAPI.listarTiposGruposMuscularesAsync();
            setGruposMusculares(grupos);
        } catch (error) {
            toast.error("Erro ao buscar grupos musculares!");
        }
    }

    function handleGrupoChange(e) {
        const valor = e.target.value;
        setGrupoSelecionado(valor);
    }

    const abrirModalCompartilhar = async (treino) => {
        try {
            const usuarios = await UsuarioAPI.listarUsuariosAsync(true);

            const usuariosFiltrados = usuarios.filter((u) => u.id !== usuario.id);

            setAlunosDisponiveis(usuariosFiltrados);
            setTreinoSelecionado(treino);
            setMostrarModal(true);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            toast.error("Erro ao carregar lista de usuários.");
        }
    };

    const compartilharTreino = async () => {
        if (alunoSelecionadoId.length === 0) {
            toast.warn("Por favor, selecione pelo menos um aluno para compartilhar.");
            return;
        }
        try {
            for (const aluno of alunoSelecionadoId) {
                await TreinoAPI.compartilharTreinoAsync(treinoSelecionado.id, aluno.value);
            }
            toast.success("Treino compartilhado com sucesso!");
            setMostrarModal(false);
            setAlunoSelecionadoId("");
            setTreinoSelecionado("");
        } catch (error) {
            console.error("Erro ao compartilhar treino:", error);
            toast.error("Ocorreu um erro ao compartilhar o treino.");
        }
    };

    useEffect(() => {
        if (usuarioToken) {
            fetchUsuario(usuarioToken);
        }
    }, []);

    useEffect(() => {
        if (!usuario) return;

        fetchGruposMusculares();
        fetchTreinos();

    }, [usuario, grupoSelecionado]);

    if (!usuario) return <p>Carregando usuário...</p>;

    const isPersonal = usuario.tipoUsuario === 0;

    return (
        <div className={style.conteudo}>
            <Topbar>
                <div className={style.dashboardContainer}>
                    <div className={style.dashboardHeader}>
                        <h2>Olá, {usuario.nome}!</h2>
                        <div className={style.filtroEacoes}>
                            <div className={style.filtroContainer}>
                                <label htmlFor="grupoMuscular">Filtrar por grupo muscular:</label>
                                <select
                                    id="grupoMuscular"
                                    value={grupoSelecionado}
                                    onChange={handleGrupoChange}
                                    className={style.select}
                                >
                                    <option value="">Todos</option>
                                    {gruposMusculares.map(grupo => (
                                        <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.botoesAcao}>
                                {isPersonal && (
                                    <button onClick={() => navigate("/criar-treino")}>+ Criar Treino</button>
                                )}
                                <button onClick={() => navigate("/assistente-treino")}>IA: Criar Treino</button>
                            </div>
                        </div>
                    </div>

                    <div className={style.treinosGrid}>
                        {carregando ? (
                            <p>Carregando treinos...</p>
                        ) : treinos.length === 0 ? (
                            <p>Nenhum treino disponível.</p>
                        ) : (
                            treinos.map((treino) => (
                                <div key={treino.id} className={style.cardTreino}>

                                    <h3 title={treino.nome}>{treino.nome}</h3>

                                    <div className={style.cardInfo}>
                                        <p><strong>Personal:</strong> {treino.personalNome || "Desconhecido"}</p>
                                        <p><strong>Exercícios:</strong> {treino.quantidadeExercicios || 0}</p>
                                        <p><strong>Tempo estimado:</strong> {treino.tempoEstimado || 0} minutos</p>
                                    </div>

                                    {treino.geradoPorIa && (
                                        <div className={style.geradoPorIa}>
                                            <p><strong>Aviso:</strong> Este treino foi gerado por IA.</p>
                                            <p>Consulte um personal trainer, pois esta é apenas uma sugestão e você deve confirmar seus dados e vieses.</p>
                                        </div>
                                    )}

                                    <div className={style.botoesCard}>
                                        {isPersonal && treino.personalId === usuario.id && (
                                            <button onClick={() => abrirModalCompartilhar(treino)}>Compartilhar</button>
                                        )}
                                        <button onClick={() => navigate(`/treino/${treino.id}`)}>Exibir Treino</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {
                    mostrarModal && (
                        <div className={style.modalOverlay}>
                            <div className={style.modalContent}>
                                <h3>Compartilhar treino: {treinoSelecionado.nome}</h3>

                                <label>Selecione os alunos:</label>
                                <Select
                                    isMulti
                                    options={alunosDisponiveis.map(aluno => ({ value: aluno.id, label: aluno.nome }))}
                                    value={alunoSelecionadoId}
                                    onChange={(selected) => setAlunoSelecionadoId(selected)}
                                    className={style.reactSelect}
                                    placeholder="Escolha os alunos para compartilhar"
                                    classNamePrefix="reactSelect"
                                />

                                <div className={style.modalBotoes}>
                                    <button className={style.btnCompartilhar} onClick={compartilharTreino}>Compartilhar</button>
                                    <button className={style.btnCancelar} onClick={() => setMostrarModal(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )
                }


            </Topbar >
        </div >
    )


}