import React from "react";
import header from "./Header"
import Nav from "./Nav";
export default function Mensagens(){
    const [mensagens,setMensagens] = React.useState();

async function fetchD(){
    const res = await fetch('http://localhost/projeto-forum/php/api.php?msg=1',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify({tokenJWT: localStorage.getItem('tokenJWT')})
       })
    const dados = await res.json()
    setMensagens(dados.msg)
    console.log(dados.msg)
}
    
    React.useEffect(() => {
        fetchD()
    },[])

    if(mensagens){
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
    }else{
        return <p>Não está logado</p>
    }
  
}