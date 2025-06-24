import { useState } from 'react';
import style from './RedefinirSenha.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import authAPI from '../../services/authAPI';
import LogoFitConnect from "./../../assets/LogoSemFundo.png";
import { MdLock } from "react-icons/md";

const RedefinirSenha = () => {

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setMensagemErro("");
    try {
      await authAPI.redefinirSenha(email, novaSenha, confirmarSenha);
      setMensagem("Senha redefinada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      const mensagemErro = error.response?.data || "Erro ao alterar senha.";
      setMensagemErro(mensagemErro);
    }
  };

  return (
    <div className={style.conteudo}>
      <div className={style.card_container}>
        <div className={style.header}>
          <img src={LogoFitConnect} alt="logo" className={style.logo}></img>
        </div>
        <form onSubmit={handleSubmit} className={style.formContainer}>
          <label className={style.label}>Email</label>
          <div className={style.inputContainer}>
            <MdLock className={style.inputIcon} />
            <input type='password' placeholder='nova senha' required className={style.input} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
          </div>
          <div className={style.inputContainer}>
            <MdLock className={style.inputIcon} />
            <input type='password' placeholder='confirmar senha' required className={style.input} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
          </div>
          <button type="submit" class={style.btnSalvar}>Salvar nova senha</button>
          {mensagem && <p className={style.mensagem} style={{ color: 'green' }}>{mensagem}</p>}
          {mensagemErro && <p className={style.mensagem} style={{ color: 'red' }}>{mensagemErro}</p>}
        </form>
      </div>
    </div>
  )
}

export default RedefinirSenha;