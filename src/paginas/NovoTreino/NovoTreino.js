import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import Topbar from '../../componentes/Topbar/Topbar';
import ExercicioAPI from '../../services/exercicioAPI';
import TreinoAPI from '../../services/treinoAPI';
import style from './NovoTreino.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function NovoTreino() {

    const usuarioToken = GetUsuarioToken();
    const navigate = useNavigate();

    const [nomeTreino, setNomeTreino] = useState("");
    const [treinoId, setTreinoId] = useState(null);
    const [exercicios, setExercicios] = useState([]);
    const [exercicioSelecionado, setExercicioSelecionado] = useState("");
    const [series, setSeries] = useState("");
    const [exerciciosAdicionados, setExerciciosAdicionados] = useState([]);
    const [gruposMusculares, setGruposMusculares] = useState([]);
    const [grupoMuscularSelecionado, setGrupoMuscularSelecionado] = useState("");

    async function fetchExericios() {
        try {
            const listaExercicios = await ExercicioAPI.listarAsync(true);
            setExercicios(listaExercicios);
        } catch (error) {
            alert("Erro ao carregar exercícios!");
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
        fetchExericios();
        fetchGruposMusculares();
    }, []);

    async function criarTreino() {
        if (!nomeTreino) {
            return alert("Informe um nome para o treino!");
        }

        try {
            const id = await TreinoAPI.criarAsync(nomeTreino, usuarioToken.usuarioId);
            setTreinoId(id);
        } catch (error) {
            alert("Erro ao criar treino!");
        }
    }

    async function adicionarExercicio() {
        if (!exercicioSelecionado || !series) return alert("Selecione um exercício e informe as séries!");

        const exercicioExistente = exerciciosAdicionados.some(e => e.id === parseInt(exercicioSelecionado));
        if (exercicioExistente) {
            return alert("Este exercício já foi adicionado ao treino.");
        }

        try {
            await TreinoAPI.adicionarExericio(
                treinoId,
                parseInt(exercicioSelecionado),
                series
            );

            const exercicio = exercicios.find(e => e.id === parseInt(exercicioSelecionado));

            setExerciciosAdicionados([...exerciciosAdicionados, {
                id: exercicio.id,
                nome: exercicio.nome,
                series,
                grupoMuscular: exercicio.grupoMuscular
            }]);

            setExercicioSelecionado("");
            setSeries("");

        } catch (error) {
            alert("Erro ao adicionar exercício");
        }
    }

    function finalizar() {
        alert("Treino finalizado com sucesso!");
        navigate("/dashboard");
    }

    return (
        <Topbar>
            <div className={style.conteudo}>
                <div className={style.card_container}>
                    <h2>Criar Novo Treino</h2>

                    {!treinoId ? (
                        <div className={style.form_container}>
                            <input
                                className={style.input}
                                type="text"
                                placeholder="Nome do treino"
                                value={nomeTreino}
                                onChange={(e) => setNomeTreino(e.target.value)}
                            />
                            <button className={style.btnForm} onClick={criarTreino}>Criar Treino</button>
                        </div>
                    ) : (
                        <div className={style.form_container}>
                            <h3>Treino: {nomeTreino}</h3>
                            <label className={style.label}>Grupos musculares</label>
                            <div className={style.inputContainer}>
                                <select
                                    className={style.input}
                                    value={grupoMuscularSelecionado}
                                    onChange={(e) => setGrupoMuscularSelecionado(e.target.value)}
                                >
                                    <option value="">Todos os grupos musculares</option>
                                    {gruposMusculares.map(grupo => (
                                        <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <label className={style.label}>Exercícios</label>
                            <div className={style.inputContainer}>
                                <select
                                    className={style.input}
                                    value={exercicioSelecionado}
                                    onChange={(e) => setExercicioSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione um exercício</option>
                                    {exercicios
                                        .filter(e => grupoMuscularSelecionado === "" || e.grupoMuscular === parseInt(grupoMuscularSelecionado))
                                        .map((e) => (
                                            <option key={e.id} value={e.id}>{e.nome}</option>
                                        ))}
                                </select>
                            </div>

                            <label className={style.label}>Séries</label>
                            <div className={style.inputContainer}>
                                <input
                                    className={style.input}
                                    type="text"
                                    placeholder="Ex: 3x12"
                                    value={series}
                                    onChange={(e) => setSeries(e.target.value)}
                                />
                            </div>

                            <button className={style.btnForm} onClick={adicionarExercicio}>Adicionar Exercício</button>

                            <h4>Exercícios adicionados:</h4>
                            <ul>
                                {exerciciosAdicionados.map((ex, index) => (
                                    <li className={style.input} key={index}>{ex.nome} ({ex.grupoMuscular}) - {ex.series}</li>
                                ))}
                            </ul>

                            <button className={style.btnForm} onClick={finalizar}>Finalizar e Voltar</button>
                        </div>
                    )}
                </div>
            </div>
        </Topbar>
    );

}

export default NovoTreino;