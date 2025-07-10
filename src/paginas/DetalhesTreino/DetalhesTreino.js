import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GetUsuarioToken from "../../componentes/JwtDecode/GetUsuarioToken";
import Topbar from "../../componentes/Topbar/Topbar";
import TreinoAPI from "../../services/treinoAPI";
import ExercicioAPI from "../../services/exercicioAPI";
import style from "./DetalhesTreino.module.css";
import UsuarioAPI from "../../services/usuarioAPI";

export function DetalhesTreino() {
    const { id } = useParams();
    const usuarioToken = GetUsuarioToken();
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const [treino, setTreino] = useState(null);
    const [exercicios, setExercicios] = useState([]);
    const [nomeEditavel, setNomeEditavel] = useState("");
    const [editando, setEditando] = useState(false);
    const [exercicioSelecionado, setExercicioSelecionado] = useState("");
    const [series, setSeries] = useState("");
    const [todosExercicios, setTodosExercicios] = useState([]);
    const [gruposMusculares, setGruposMusculares] = useState([]);
    const [grupoMuscularSelecionado, setGrupoMuscularSelecionado] = useState("");

    async function fetchUsuario(usuarioToken) {
        try {
            const response = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
            setUsuario(response);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

    async function carregarDados() {
        try {
            const dadosTreino = await TreinoAPI.obterAsync(id);
            setTreino(dadosTreino);
            setNomeEditavel(dadosTreino.nome);

            const listaExercicios = await ExercicioAPI.listarPorTreinoAsync(id);
            setExercicios(listaExercicios);

            const todosExercicios = await ExercicioAPI.listarAsync(true);
            setTodosExercicios(todosExercicios);
        } catch (error) {
            alert("Erro ao carregar dados do treino.");
        }
    }

    async function fetchGruposMusculares() {
        try {
            const tiposGruposMusculares = await ExercicioAPI.listarTiposGruposMuscularesAsync();
            setGruposMusculares(tiposGruposMusculares);
        } catch (error) {
            alert("Erro ao buscar grupos musculares!");
        }
    }

    useEffect(() => {
        if (usuarioToken) {
            fetchUsuario(usuarioToken);
        }
    }, []);

    useEffect(() => {
        if (usuario) {
            carregarDados();
            fetchGruposMusculares();
        }
    }, [usuario]);

    if (!treino || !usuario) return <p>Carregando dados...</p>;

    const isPersonal = usuario.tipoUsuario === 0;
    const visualizacaoSomente = !isPersonal || treino.personalId !== usuario.id;

    async function salvarNome() {
        try {
            await TreinoAPI.atualizarAsync(treino.id, nomeEditavel);
            alert("Nome atualizado!");
        } catch (error) {
            alert("Erro ao salvar nome!");
        }
    }

    async function adicionarExercicio() {
        if (!exercicioSelecionado || !series) {
            return alert("Preencha todos os campos!");
        }

        const exercicioId = parseInt(exercicioSelecionado);
        const jaExiste = exercicios.some(e => e.exercicioId === exercicioId);

        if (jaExiste) {
            return alert("Exercício já adicionado!");
        }

        try {
            const response = await TreinoAPI.adicionarExericio(treino.id, exercicioId, series);

            const exercicio = todosExercicios.find(e => e.id === exercicioId);

            // Adicionando manualmente os dados para manter consistência
            const novoExercicio = {
                ...exercicio,
                exercicioId: exercicioId,
                exercicioTreinoId: response.id, // supondo que o backend retorne o id da nova relação
                series: series
            };

            setExercicios([...exercicios, novoExercicio]);
            setExercicioSelecionado("");
            setSeries("");
        } catch (error) {
            alert("Erro ao adicionar exercício!");
        }
    }


    async function excluirExercicio(exercicioTreinoId, exercicioId) {
        try {
            await TreinoAPI.removerExercicioAsync(exercicioTreinoId);
            setExercicios(exercicios.filter(e => e.id !== exercicioTreinoId));
        } catch (error) {
            alert("Erro ao remover exercício!");
        }
    }

    async function excluirTreino() {
        if (!window.confirm("Deseja realmente excluir este treino?")) return;
        try {
            await TreinoAPI.deletarAsync(treino.id);
            navigate("/dashboard");
        } catch {
            alert("Erro ao excluir treino.");
        }
    }

    return (
        <Topbar>
            <div className={style.conteudo}>
                <div className={style.card_container}>
                    <h2>{treino.nome}</h2>

                    <div className={style.exerciciosContainer}>
                        {exercicios.map((e) => (
                            <div key={e.id} className={style.cardExercicio}>
                                <h4>{e.nome}</h4>
                                <p><strong>Grupo Muscular:</strong> {gruposMusculares.find(g => g.id === e.grupoMuscular)?.nome || "Desconhecido"}</p>
                                <p><strong>Séries:</strong> {e.series}</p>
                                <p><strong>Descrição:</strong> {e.descricao}</p>
                                {e.videoURL && (
                                    <>
                                        {e.videoURL.includes("youtube.com") || e.videoURL.includes("youtu.be") ? (
                                            <div className={style.videoContainer}>
                                                <iframe
                                                    width="100%"
                                                    height="315"
                                                    src={e.videoURL.replace("watch?v=", "embed/")}
                                                    title="Vídeo de demonstração"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <video width="100%" controls>
                                                <source src={e.videoURL} type="video/mp4" />
                                                Seu navegador não suporta vídeo.
                                            </video>
                                        )}
                                    </>
                                )}

                                {editando && (
                                    <div className={style.removerContainer}>
                                        <button className={style.btnExcluir} onClick={() => excluirExercicio(e.id, e.exercicioId)}>Remover</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {editando && (
                        <div className={style.edicaoContainer}>
                            <input
                                className={style.input}
                                type="text"
                                value={nomeEditavel}
                                onChange={(e) => setNomeEditavel(e.target.value)}
                                placeholder="Nome do treino"
                            />
                            <button className={style.btnForm} onClick={salvarNome}>Salvar nome</button>

                            <label className={style.label}>Grupo Muscular</label>
                            <select
                                className={style.input}
                                value={grupoMuscularSelecionado}
                                onChange={(e) => setGrupoMuscularSelecionado(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {gruposMusculares.map(grupo => (
                                    <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                                ))}
                            </select>

                            <label className={style.label}>Exercício</label>
                            <select
                                className={style.input}
                                value={exercicioSelecionado}
                                onChange={(e) => setExercicioSelecionado(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                {todosExercicios
                                    .filter(e => grupoMuscularSelecionado === "" || e.grupoMuscular === parseInt(grupoMuscularSelecionado))
                                    .map((e) => (
                                        <option key={e.id} value={e.id}>{e.nome}</option>
                                    ))}
                            </select>

                            <input
                                className={style.input}
                                type="text"
                                placeholder="Séries (ex: 3x12)"
                                value={series}
                                onChange={(e) => setSeries(e.target.value)}
                            />
                            <button className={style.btnForm} onClick={adicionarExercicio}>Adicionar Exercício</button>
                        </div>
                    )}

                    {!visualizacaoSomente && (
                        <div className={style.acoesTreino}>
                            <button className={style.btnForm} onClick={() => setEditando(!editando)}>
                                {editando ? "Cancelar Edição" : "Editar Treino"}
                            </button>
                            <button className={style.btnExcluir} onClick={excluirTreino}>Excluir Treino</button>
                        </div>
                    )}
                    <div className={style.voltarContainer}>
                        <button className={style.btnVoltar} onClick={() => navigate("/dashboard")}>Voltar</button>
                    </div>
                </div>
            </div>
        </Topbar>
    );
}

export default DetalhesTreino;
