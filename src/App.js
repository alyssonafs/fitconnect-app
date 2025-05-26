import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './paginas/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
