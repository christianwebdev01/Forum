import React from "react"
import header from "./Header"

export default function Adm(){
 const [dados, setDados] = React.useState();
 const [form,setForm] = React.useState({
    texto: '',
    id: '10' //Consertar depois
 });
 async function fetchD(){
    const res = await fetch('http://localhost/projeto-forum/php/confirm.php?papel=1',{
        method: 'POST',
        headers: header,
        credentials: 'include',
        body: JSON.stringify({tokenJWT: localStorage.getItem('tokenJWT')})
    })
    const dados = await res.json()
    setDados(dados.users)
    console.log(dados);
   } 
    React.useEffect(() =>{
        fetchD()
    },[])

    async function handleSubmit(ev){
        ev.preventDefault();
        const config = {
            method: 'POST',
            headers: header,
            credentials: 'include',
            body: JSON.stringify(form)
        }
        const res = await fetch("http://localhost/projeto-forum/php/adm.php", config);
        const dados = await res.json();
        console.log(form)
        console.log(dados)
        window.location.href = "/" 
    }
    //Pegando id do usuario para enviar junto a mensagem
    const handleOpt = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const selectedOption = event.target.options[selectedIndex];
        const id = selectedOption.getAttribute('data-id');
        setForm({ ...form, id: id });
        console.log(id)
      };
    
    if(dados){
        return (
                <form onSubmit={handleSubmit} method="post" style={{display: "flex", flexDirection: "column"}}>
                <select onChange={handleOpt} name="username" style={{width: '200px'}}>
           {dados.map((item,i)=>{
             return(
            <>
             <option key={i} data-id={item.usuarios_id} value={item.username}>{item.username}</option>
            </>
             )
            })}
            </select>
            <textarea onChange={(ev) => {
                setForm({...form,texto: ev.target.value})  
            }}name='texto' style={{width: '450px', height: '100px'}}></textarea>
            <button style={{width: '200px'}} type="submit">Enviar</button>
            </form>
        )
    } else{
       return <>Carregando</>
    } 
}