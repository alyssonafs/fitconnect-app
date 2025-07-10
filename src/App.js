import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './paginas/Login/Login';
import SolicitarRecuperacao from './paginas/SolicitarRecuperacao/SolicitarRecuperacao';
import RedefinirSenha from './paginas/RedefinirSenha/RedefinirSenha';
import NovoUsuario from './paginas/NovoUsuario/NovoUsuario';
import { Dashboard } from './paginas/Dashboard/Dashboard';
import EditarUsuario from './paginas/EditarUsuario/EditarUsuario';
import NovoTreino from './paginas/NovoTreino/NovoTreino';
import { DetalhesTreino } from './paginas/DetalhesTreino/DetalhesTreino';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/solicitar-recuperacao' element={<SolicitarRecuperacao />} />
        <Route path='/redefinir-senha' element={<RedefinirSenha />} />
        <Route path='/novo-usuario' element={<NovoUsuario />} />
        <Route path='/editar-usuario' element={<EditarUsuario />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/criar-treino' element={<NovoTreino />} />
        <Route path='/treino/:id' element={<DetalhesTreino />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
