import { Outlet } from "react-router-dom";


export default function Boards (){
    const classe = new URLSearchParams(window.location.search).get('r')
    console.log(classe)
    return (
        <div className={classe}>
        <h2>Board</h2>
        <p style={{color:'green'}}>
        --implantar comentarios + contador<br/>
        --mensagens de erro<br/>
        --sistema de reportar<br/>
        </p>
       
        <Outlet/>
        </div>
    )
}