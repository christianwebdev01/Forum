import React from "react";
import header from "./Header"
import { Link } from "react-router-dom";
export default function Login(){
 const [form,setForm] = React.useState({
    username: '',
    senha: ''
 });
 const [error,setError] = React.useState('');

 //Salva informações no Local Storage
 function localSt(chave,valor){
    localStorage.setItem(chave, valor)
 }
 

//Envia dados do usuário ao servidor
 function handleSubmit(ev){
    ev.preventDefault()
    const config = {
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify(form)
    }
    fetch('http://localhost/projeto-forum/php/api.php', config)
    .then(res => {
        return res.json()
    }).then(dados => {
        
        //Recebe token do servidor e acrescenta ao localStorage com data de expiração
        if(dados.token){
            const tokenArr = dados.token.split('.')
            localSt('tokenJWT', JSON.stringify({
                token: tokenArr,
                expiration: Date.now() + 3600000 //Mais uma hora
            }))
            //'logado' serve apenas como pista, a verificação de fato ocorre sempre com JWT
            window.sessionStorage.setItem('logado','1')
            window.location.replace("http://localhost:3000");
            return
        } else if(dados.alerta){
            setError(dados.alerta)
            return
        }})}

    if(window.sessionStorage.getItem('logado') === '1'){
       return (
        <>
        <p>Você está logado</p>
        <Link to='/'>Voltar</Link>
        </>
       )
    }else{
        return (
            <div>
                <p className="alerta">{error}</p>
            <form method="post" onSubmit={handleSubmit}>
               <input onChange={(ev) => {
                setForm({...form, username: ev.target.value})
               }} 
               type="text" 
               name="username" 
               placeholder="Username"/>
               <input 
               onChange={ev => {
                setForm({...form, senha: ev.target.value})
               }}
               type="text" 
               name="senha" 
               placeholder="Senha"/>
               <button type="submit" name="enviar">Log-in</button>
            </form>
            </div>
            )}}