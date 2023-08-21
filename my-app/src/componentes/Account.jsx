import React from "react"
import header from "./Header"
import { Link } from "react-router-dom";
import Nav from './Nav.jsx'
//para decodar htmlentities 
import he from 'he';

export default function Account(){
    const [valido,setValido] = React.useState();
    const [foto,setFoto] = React.useState('');
    const [bio,setBio] = React.useState('');
    const [nome,setNome] = React.useState('');
    const [username,setUsername] = React.useState('');

    //Envio do token ao servidor
    const body = {
    tokenJWT: localStorage.getItem('tokenJWT'),
    id: localStorage.getItem('id')
    }
    async function fetchD(){
        const response = await fetch('http://localhost/projeto-forum/php/confirm.php',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify(body)
    }) 
    //Compara a signature e o tempo de expiração
    const dados = await response.json()
    setValido(dados.valido)

    //Se foto,bio,nome e username existem:
    if(dados.foto){
        setFoto(dados.foto)
        window.localStorage.setItem('foto', dados.foto)
    }
    if(dados.bio){
        window.localStorage.setItem('bio', dados.bio)
        setBio(he.decode(dados.bio))
    } 
    if(dados.nome && dados.username){
    setNome(dados.nome)
    setUsername(dados.username)
    }
}
React.useEffect(() => {
fetchD()   
},[])
    if(valido === undefined){
        return <div>Carregando...</div>
    }
    else if(valido === 1){
        return (
            <>
            <Nav/>
            <div>
           {username ? '@'+username : 'loading'}
           {foto && <img style={{display: 'block'}} width='200px' height='150px' src={`data:image/jpeg;base64, ${foto}`}/> }
           {nome ?? 'loading'}
           {bio && <p>{bio}</p>}
           <Link to='/Mensagens'>SMS</Link>
            </div>
            </>
        )
    } else {
        return <div>Acesso inválido</div>
    }
}