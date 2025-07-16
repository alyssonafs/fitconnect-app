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
import { AssistenteTreino } from './paginas/AssistenteTreino/AssistenteTreino';
import PrivateRoute from './componentes/PrivateRoute/PrivateRoute';
import PublicRoute from './componentes/PublicRoute/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/solicitar-recuperacao' element={<SolicitarRecuperacao />} />
        <Route path='/redefinir-senha' element={<RedefinirSenha />} />
        <Route path='/novo-usuario' element={<NovoUsuario />} />
        <Route path='/editar-usuario' element={<PrivateRoute><EditarUsuario /></PrivateRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/criar-treino' element={<PrivateRoute><NovoTreino /></PrivateRoute>} />
        <Route path='/treino/:id' element={<PrivateRoute><DetalhesTreino /></PrivateRoute>} />
        <Route path='/assistente-treino' element={<PrivateRoute><AssistenteTreino /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
