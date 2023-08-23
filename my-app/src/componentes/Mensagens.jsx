import React, { useState } from "react";
import header from "./Header"
import Nav from "./Nav";
export default function Mensagens(){
    const [erro,setErro] = useState()
    const [mensagens,setMensagens] = React.useState();

async function fetchD(){
    const res = await fetch('http://localhost/projeto-forum/php/api.php?msg=1',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify({tokenJWT: localStorage.getItem('tokenJWT')})
       })
    const dados = await res.json()
    if(dados.erro) setErro(dados.erro)
    setMensagens(dados.msg)
    console.log(dados.msg)
}
    
    React.useEffect(() => {
        fetchD()
    },[])

    if(mensagens && !erro){
        return (
            <>
            <Nav/>
           {mensagens.map((item,i) => {
            return(
                <div key={i}>
                <h2>{item.por}</h2>
                <p>{item.texto}</p>
                </div>
            )
           })}
            </>
        )
    }else if(!erro && !mensagens){
        return <p className="carregando">Carregando</p>
    }else{
        return <p className="alerta">Não está logado</p>
    }
  
}