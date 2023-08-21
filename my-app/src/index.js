import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import Login from './componentes/Login';
import { Route, Routes } from "react-router-dom";
import Logout from './componentes/Logout';
import Account from './componentes/Account';
import Mensagens from './componentes/Mensagens';
import Adm from './componentes/Adm';
import Entretenimento from './componentes/boards/Entretenimento';
import Boards from './componentes/boards/Boards';
import Submit from './componentes/boards/Submit';
import Tecnologia from './componentes/boards/Tecnologia';
import Politica from './componentes/boards/Politica';
import Financas from './componentes/boards/Financas';
import Aleatorio from './componentes/boards/Aleatorio';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //Rotas
  <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<App/>}/>
    <Route path='/Login' element={<Login/>} />
    <Route path='/Adm' element={<Adm/>} />
    <Route path='/Logout' element={<Logout/>} />
    <Route path='/Account' element={<Account/>} />
    <Route path='/Mensagens' element={<Mensagens/>} />
    <Route path='boards' element={<Boards/>}>
      <Route path='/boards/submit/:b' element={<Submit/>}/>
      <Route path='ent' element={<Entretenimento/>}/>
      <Route path='tec' element={<Tecnologia/>}/>
      <Route path='al' element={<Aleatorio/>}/>
      <Route path='fin' element={<Financas/>}/>
      <Route path='pol' element={<Politica/>}/>
    </Route>
    </Routes>
    </BrowserRouter>
  </>
);

reportWebVitals();
