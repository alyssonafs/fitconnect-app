import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './paginas/Login/Login';
import SolicitarRecuperacao from './paginas/SolicitarRecuperacao/SolicitarRecuperacao';
import RedefinirSenha from './paginas/RedefinirSenha/RedefinirSenha';
import NovoUsuario from './paginas/NovoUsuario/NovoUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/solicitar-recuperacao' element={<SolicitarRecuperacao />} />
        <Route path='/redefinir-senha' element={<RedefinirSenha />} />
        <Route path='/novo-usuario' element={<NovoUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
