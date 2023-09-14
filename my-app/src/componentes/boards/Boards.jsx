import { Outlet } from "react-router-dom";


export default function Boards (){
    const classe = new URLSearchParams(window.location.search).get('r')
    console.log(classe)
    return (
        <div className={classe}>
        <h2>Board</h2>
        <p style={{color:'green'}}>
        --implantar sistema de relevancia mais robusto<br/>
        --implantar mais personalizações nos posts<br/>
        --implantar replies<br/>
        </p>
       
        <Outlet/>
        </div>
    )
}