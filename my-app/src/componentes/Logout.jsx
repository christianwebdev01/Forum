import React from "react"
import header from "./Header"
import { Link } from "react-router-dom"

export default function Logout(){
    const [nome,setNome] = React.useState()

    async function fetchDel(){
        const response = await fetch('http://localhost/projeto-forum/php/confirm.php?del=1',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify({tokenJWT: localStorage.getItem('tokenJWT')})
    })
    
    //Limpeza de dados guardados
    sessionStorage.clear()
    localStorage.clear()
    window.location.replace('http://localhost:3000')
}
    async function fetchD(){
        const response = await fetch('http://localhost/projeto-forum/php/confirm.php?nome=1',{
        method: 'GET',
        headers: header,
        credentials: 'include'
    })
    const dados = await response.json()
    setNome(dados.nome)
}
React.useEffect(()=>{
    fetchD()
},[])
    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
        <h3>Tem certeza que deseja sair {nome}?</h3>
        <button style={{width: '50px'}} onClick={fetchDel}>Sim</button>
    <Link to={'/'}>Voltar</Link>
        </div>
    )
}