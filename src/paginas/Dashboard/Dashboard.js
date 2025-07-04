import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import { Topbar } from '../../componentes/Topbar/Topbar';
import TreinoAPI from '../../services/treinoAPI';
import UsuarioAPI from '../../services/usuarioAPI';
import style from './Dashboard.module.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {

    const usuarioToken = GetUsuarioToken();
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    const [treinos, setTreinos] = useState([]);
    const [carregando, setCarregando] = useState(true)

    const [mostrarModal, setMostrarModal] = useState(false);
    const [treinoSelecionado, setTreinoSelecionado] = useState(null);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);

    async function fetchUsuario(usuarioToken) {
        try {
            const response = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setUsuario(response);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

    async function fetchTreinosPersonal() {
        try {
            const criados = await TreinoAPI.listarTreinosPerosnalAsync(usuario.id);

            const treinosIds = await TreinoAPI.listarTreinosAlunoAsync(usuario.id);
            const promises = treinosIds.map(item => TreinoAPI.obterAsync(item.treinoId));
            const compartilhados = await Promise.all(promises);

            const todosTreinos = [...criados, ...compartilhados];
            setTreinos(todosTreinos);
        } catch (error) {
            console.error("Erro ao buscar treinos do personal:", error);
        } finally {
            setCarregando(false);
        }
    }

    async function fetchTreinosAluno() {
        try {
            const treinosIds = await TreinoAPI.listarTreinosAlunoAsync(usuario.id);

            const promises = treinosIds.map(item => TreinoAPI.obterAsync(item.treinoId));
            const treinosDetalhados = await Promise.all(promises);

            setTreinos(treinosDetalhados);
        } catch (error) {
            console.error("Erro ao buscar treinos do aluno:", error);
        } finally {
            setCarregando(false);
        }
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
            alert("Erro ao carregar lista de usuários.");
        }
    };

    const compartilharTreino = async () => {
        if (!alunoSelecionadoId || !treinoSelecionado) {
            alert("Por favor, selecione um usuário para compartilhar.");
            return;
        }
        try {
            await TreinoAPI.compartilharTreinoAsync(treinoSelecionado.id, alunoSelecionadoId);
            alert("Treino compartilhado com sucesso!");
            setMostrarModal(false);
            setAlunoSelecionadoId("");
            setTreinoSelecionado("");
        } catch (error) {
            console.error("Erro ao compartilhar treino:", error);
            alert("Ocorreu um erro ao compartilhar o treino.");
        }
    };

    useEffect(() => {
        if (usuarioToken) {
            fetchUsuario(usuarioToken);
        }
    }, []);

    useEffect(() => {
        if (!usuario) return;

        if (usuario.tipoUsuario === 0) {
            fetchTreinosPersonal();
        } else {
            fetchTreinosAluno();
        }

    }, [usuario]);

    if (!usuario) return <p>Carregando usuário...</p>;

    const isPersonal = usuario.tipoUsuario === 0;

    return (
        <div className={style.conteudo}>
            <Topbar>
                <div className={style.dashboardContainer}>
                    <h2>Olá, {usuario.nome}!</h2>

                    <div className={style.botoesAcao}>
                        {isPersonal && (
                            <button onClick={() => navigate("/criar-treino")}>+ Criar Treino</button>
                        )}
                        <button onClick={() => navigate("/assistente-treino")}>IA: Criar Treino</button>
                    </div>

                    <div className={style.treinosGrid}>
                        {carregando ? (
                            <p>Carregando treinos...</p>
                        ) : treinos.length === 0 ? (
                            <p>Nenhum treino disponível.</p>
                        ) : (
                            treinos.map((treino) => (
                                <div key={treino.id} className={style.cardTreino}>
                                    <h3>{treino.nome}</h3>
                                    <p>{treino.descricao}</p>
                                    <div className={style.botoesCard}>
                                        {isPersonal && treino.personalId === usuario.id && (
                                            <button onClick={() => abrirModalCompartilhar(treino)}>Compartilhar</button>
                                        )}
                                        <button onClick={() => navigate(`/treino/${treino.id}`)}>Ver detalhes</button>
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

                                <select
                                    className={style.input}
                                    value={alunoSelecionadoId || ""}
                                    onChange={(e) => setAlunoSelecionadoId(parseInt(e.target.value))}
                                >
                                    <option value="">Selecione o aluno</option>
                                    {alunosDisponiveis.map((aluno) => (
                                        <option key={aluno.id} value={aluno.id}>
                                            {aluno.nome}
                                        </option>
                                    ))}
                                </select>

                                <div className={style.modalBotoes}>
                                    <button className={style.btnCompartilhar} onClick={compartilharTreino}>Compartilhar</button>
                                    <button className={style.btnCancelar} onClick={() => setMostrarModal(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )
                }


            </Topbar>
        </div>
    )


}