import Contato from "./Contato";
import { Link } from "react-router-dom";
import React from "react";
import header from "./Header"


export default function Nav(){
    const [papel,setPapel] = React.useState()
async function fetchD(){
    //JWT não necessário
    const res = await fetch('http://localhost/projeto-forum/php/api.php?nav=1',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify({'id':localStorage.getItem('id')})
    })    
    const dados = await res.json()
    setPapel(dados.papel)

} React.useEffect(()=>{
    fetchD()
},[])

    return(
    <div className="nav">
        {window.sessionStorage.getItem('logado') === '1' ? 
        <>
        {papel === 1 ? <Link to={'/Adm'}>Administration</Link> : ''}
        {window.location.href === 'http://localhost:3000/Account' ? <Link to={'/'}>HomePage</Link> : <Link to={'/Account'}>Account</Link>}
        {window.location.href === 'http://localhost:3000/Mensagens' ? <Link to={'/'}>HomePage</Link> : <Link to={'/Mensagens'}>Messages</Link>}
        <Contato/>
        <Link to={'/Logout'}>Log out</Link>
        </> :
        <>
        <Link to={'/Login'}>Log in</Link>
        <Contato/>
        </>
        }
    </div>
    ) 
}