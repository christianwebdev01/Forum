import React from "react";
import { useParams } from "react-router-dom"


export default function Submit(){

    const query = window.location.search;
    const url = new URLSearchParams(query)
    const voltar = url.get('voltar')

    const data = new Date();

    const {b} = useParams()
    const [dados,setDados] = React.useState({
        title: '',
        texto: '',
        imagem: '',
        comunidade: b,
        tempo: data.toLocaleTimeString(),
        data: data.toLocaleDateString()
    })
    console.log(dados.imagem)
    const body = {
        tokenJWT:localStorage.getItem('tokenJWT'),
        dados: dados
    }
    
    
    async function fetchD(){
        const response = await fetch('http://localhost/projeto-forum/php/post.php',{
        method: 'POST',
        headers: { 
        'Content-Type': 'application/json', 
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'http://localhost:3000',
        'Accept': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(body)
    });
    const dados = await response.json()
    
    
    {voltar === 'tec' && window.location.replace('http://localhost:3000/boards/tec')}
    {voltar === 'ent' && window.location.replace('http://localhost:3000/boards/ent')}
    {voltar === 'al' && window.location.replace('http://localhost:3000/boards/al')}
    {voltar === 'fin' && window.location.replace('http://localhost:3000/boards/fin')}
    {voltar === 'pol' && window.location.replace('http://localhost:3000/boards/pol')}
    }
    function handleSub(ev){
        ev.preventDefault()
        console.log(dados)

        fetchD()
        
    }
    const handleImg = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                // reader.result contém a imagem codificada em base64
                setDados({...dados, imagem: reader.result});
                console.log(dados.imagem)
              };
              reader.readAsDataURL(file);//
            }

    }
    return (
        <div>
            Comunidade - {b}
            <form encType="multipart/form-data" onSubmit={handleSub} className="formulario_post" method="post">
                <input onChange={(e) => setDados({...dados, title: e.target.value})} className="title_form_post" name="title" placeholder="Title" type="text"/>
                <textarea onChange={(e) => setDados({...dados,texto: e.target.value})} className="texto_form_post" name='texto' placeholder="Texto"/>
                <input accept="image/jpeg, image/png, image/webp" onChange={handleImg} name="imagem" type="file" />
                <input type="hidden" name="comunidade" value={b} />
                <input className="btn_form_post" type="submit" value='Postar'/>
            </form>
        </div>
    )
}