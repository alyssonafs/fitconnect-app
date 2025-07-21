// AssistenteTreino.js
import style from './AssistenteTreino.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../componentes/Topbar/Topbar';
import ExercicioAPI from '../../services/exercicioAPI';
import TreinoAPI from '../../services/treinoAPI';
import GetUsuarioToken from '../../componentes/JwtDecode/GetUsuarioToken';
import UsuarioAPI from '../../services/usuarioAPI';

const objetivos = ["Hipertrofia", "Definição", "Resistência"];

export function AssistenteTreino() {
    const usuarioToken = GetUsuarioToken();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [usuariosAlunos, setUsuariosAlunos] = useState([]);
    const [usuarioAlvoId, setUsuarioAlvoId] = useState(usuarioToken.usuarioId);
    const [gruposMusculares, setGruposMusculares] = useState([]);
    const [gruposSelecionados, setGruposSelecionados] = useState([]);
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
    const [objetivo, setObjetivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [planoGerado, setPlanoGerado] = useState(null);
    const isPersonal = usuario?.tipoUsuario === 0;

    useEffect(() => {
        async function fetchUsuario() {
            try {
                const u = await UsuarioAPI.obterAsync(usuarioToken.usuarioId);
                setUsuario(u);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsuario();
    }, []);

    useEffect(() => {
        if (!usuario) return;

        ExercicioAPI.listarTiposGruposMuscularesAsync()
            .then(setGruposMusculares)
            .catch(() => alert("Erro ao buscar grupos musculares"));

        ExercicioAPI.listarAsync(true)
            .then(setExerciciosDisponiveis)
            .catch(() => alert("Erro ao buscar exercícios"));

        if (isPersonal) {
            UsuarioAPI.listarUsuariosAsync()
                .then(setUsuariosAlunos)
                .catch(() => alert("Erro ao buscar alunos"));
        }
    }, [usuario]);

    const toggleGrupo = (id) => {
        setGruposSelecionados(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const calcularIdade = (dataNasc) => {
        const hoje = new Date();
        const nasc = new Date(dataNasc);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        if (
            hoje.getMonth() < nasc.getMonth() ||
            (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())
        ) idade--;
        return idade;
    };

    const calcularImc = (peso, altura) =>
        Number((peso / (altura * altura)).toFixed(2));

    const handleSubmit = async () => {
        if (!objetivo || gruposSelecionados.length === 0) {
            setMensagem("Selecione objetivo e pelo menos 1 grupo muscular.");
            return;
        }

        setLoading(true);
        setMensagem('');

        const exercParaDto = exerciciosDisponiveis
            .filter(e => gruposSelecionados.includes(e.grupoMuscular))
            .map(e => ({
                id: e.id,
                nome: e.nome,
                grupoMuscular: e.grupoMuscular
            }));

        const dto = {
            personalId: usuario.id,
            usuarioAlvoId,
            usuarioAlvoInfo: {
                altura: usuario.altura,
                peso: usuario.peso,
                idade: calcularIdade(usuario.dataNascimento),
                imc: calcularImc(usuario.peso, usuario.altura),
                genero: usuario.genero
            },
            objetivo,
            gruposMusculares: gruposSelecionados,
            exerciciosDisponiveis: exercParaDto
        };

        try {
            const plano = await TreinoAPI.gerarTreinoIaAsync(dto);
            setPlanoGerado(plano);
            setMensagem("✅ Treino gerado com sucesso! Redirecionando...");

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error(error);
            setMensagem("❌ Erro ao gerar treino. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return <div>Carregando usuário...</div>;

    return (
        <Topbar>
            <div className={style.conteudo}>
                <div className={style.card_container}>
                    <h2>Assistente de Treino</h2>

                    {isPersonal && (
                        <>
                            <label className={style.label}>Selecionar aluno</label>
                            <select
                                className={style.input}
                                value={usuarioAlvoId}
                                onChange={e => setUsuarioAlvoId(+e.target.value)}
                            >
                                <option value="">Selecione um aluno</option>
                                {usuariosAlunos.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.nome}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <label className={style.label}>Grupos Musculares:</label>
                    <div className={style.gruposContainer}>
                        {gruposMusculares.map(g => (
                            <button
                                key={g.id}
                                onClick={() => toggleGrupo(g.id)}
                                className={
                                    gruposSelecionados.includes(g.id)
                                        ? style.grupoBtnSelecionado
                                        : style.grupoBtn
                                }
                            >
                                {g.nome}
                            </button>
                        ))}
                    </div>

                    <label className={style.label}>Objetivo:</label>
                    <select
                        className={style.input}
                        value={objetivo}
                        onChange={e => setObjetivo(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {objetivos.map(o => (
                            <option key={o} value={o}>
                                {o}
                            </option>
                        ))}
                    </select>

                    <button
                        className={style.btnForm}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Gerando…' : 'Gerar Treino com IA'}
                    </button>
                    {mensagem && <p className={style.mensagem}>{mensagem}</p>}

                    {planoGerado && (
                        <div className={style.resultado}>
                            <h3>{planoGerado.nome}</h3>
                            <ul>
                                {(planoGerado.exercicios ?? planoGerado.Exercicios ?? []).map((ex, idx) => (
                                    <li key={idx}>{ex.nome || ex.Nome}: {ex.serie || ex.Serie}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Topbar>
    );
}
