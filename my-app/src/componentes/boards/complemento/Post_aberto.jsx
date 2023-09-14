import React, { useState } from "react"
import header from "../../Header"
import { useLocation } from "react-router-dom"
import Tempo from "./Tempo"
import Parse from "./Parse"
import Votos from "./Votos"
import Config from "./Config"

export default function Post_aberto(){

    const [replies,setReplies] = useState([])
    const [comentario,setComentario] = useState([])
    const id = new URLSearchParams(window.location.search).get('id')
    const local = useLocation()
    const [data_tempo,setData_tempo] = React.useState({
        dia:'',
        hora:'',
        valido:'',
        itens_data_diff: '',
        d_diff: ''
    })
    const {texto,nomeUser,titulo,imagem} = local.state
    const [votos_rel,setVotos_rel] = useState({})
    

    async function pegar_dados(){
        const res = await fetch(`http://localhost/projeto-forum/php/posts.php?aberto=${id}`, {
            method: 'get',
            headers: header,
            credentials: 'include'
        })
        const recebido = await res.json()
        setComentario(recebido.comentarios)
        //console.log(recebido)
        setReplies(recebido.replies)



        const itens_data_diff = Tempo(recebido.data_e_tempo.tempo);
        const data1 = Parse(recebido.data_e_tempo.data);
        const data2 = Parse(itens_data_diff[0]);
        const d_diff= (data2 - data1) / (1000 * 60 * 60 * 24)
    
        if (recebido.data_e_tempo.data === itens_data_diff[0]) {
            setData_tempo({
                hora:`Postado a ${itens_data_diff[1]} hora`,
                dia: `Postado a ${d_diff} Dia`,
                itens_data_diff: itens_data_diff[1],
                d_diff: (data2 - data1) / (1000 * 60 * 60 * 24),
                valido: 1,
                comunidade: recebido.data_e_tempo.comunidade
                })
        } else {
            setData_tempo({
                hora:`Postado a ${itens_data_diff[1]} hora`,
                dia: `Postado a ${d_diff} Dia`,
                itens_data_diff: itens_data_diff[1],
                d_diff: (data2 - data1) / (1000 * 60 * 60 * 24),
                valido: 0,
                comunidade: recebido.data_e_tempo.comunidade
                })
        }
    }

    const [string,setString] = useState('')
    
    async function votos(){
        const dados = await Votos(id);
        setVotos_rel(dados)
        const corte = dados.nomes.slice(1)
        corte.map((item)=>{
            //console.log('aqui')
            //console.log(corte)
            //console.log('item '+item)
            setString(prev => prev+`${item.username} deu ${item.valor}, `) 
        })
    }

    React.useEffect(()=>{
        pegar_dados()
        votos()
    },[])
    React.useEffect(()=>{
        console.log(comentario)
        console.log(replies)
    },[comentario, replies])

    //POSTAGEM DO COMENTARIO 
    const [comentario_inserir,setComentario_inserir] = useState('')
    function handleSubmit(ev){

        if(comentario_inserir.length > 0 && comentario_inserir !== null){
            (async function postar_comentario(){
                const config = Config('POST',comentario_inserir)
                const res = await fetch(`http://localhost/projeto-forum/php/posts.php?comentar=${id}`,config)
                const dados = await res.json()
                //console.log(dados)
                window.location.reload()
            })()
        }

    }


    return(
    <div className="aberto">
      <div className="post_box v2">
        <p className="comunidade ">Postado na comunidade: <span>{data_tempo.comunidade}</span></p>
      {data_tempo.valido === 0 ? data_tempo.d_diff === 1 ? data_tempo.dia : `${data_tempo.dia}s` : ''}
        {(data_tempo.valido === 1) && (data_tempo.itens_data_diff === 0) ? "Postado a alguns minutos": ''}
        {(data_tempo.valido === 1) && (data_tempo.itens_data_diff !== 0) ? (data_tempo.itens_data_diff === 1) ? data_tempo.hora : `${data_tempo.hora}s` : ''}
        <h1 className="titulo_post">{titulo}</h1>
        <p className="bio_post">{texto}</p>
        {imagem && <img className='img_post' src={`data:image/png;base64,${imagem}`}/>}
        <p>Interações:<span className="nomes_upvotes"> {string.substring(0,string.length-2)}</span><button>Ver mais...</button></p>
        <button
         className={votos_rel ? (votos_rel.msg >= 1) ? 'green' : (votos_rel.msg < 0) ? 'red' : '' : ''}
        >{votos_rel.msg}</button>
        <button>DOWN</button>
       <span className="feito_por_post">{nomeUser}</span>
      </div>
      <div className="comments_box">
        --RESPONDER comentarios adiciona um reply a ele<br/>
        --REFERENCIAR replies resulta em uma refêrencia ao nome deles
        <h2>Acrescente à discussão:</h2>
        <div className="caixa_comments">

            <textarea
            className="box_de_comentar" 
            placeholder={localStorage.getItem('username') ? `Responda a postagem como ${localStorage.getItem('username')}` : 'Responda a postagem anônimamente'}
            onChange={(ev) => setComentario_inserir(ev.target.value)}
            value={comentario_inserir}
            ></textarea>
            <button 
            onClick={handleSubmit}
            className="enviar_comentario">Enviar</button>
        {comentario && comentario.map((i)=>{
            console.log('main '+i.comentarios_id)
                return(
                    <div>
                        <p className="comentario_individual">{i.texto} - <span className="nome_user">{i.username === null ? 'anônimo' :i.username}</span> <span className="responder">RESPONDER</span><br/></p>
                        <p>{replies && replies.map((item)=>{
                            console.log('rep '+item.second_comment_id)
                            console.log('ToF '+item.second_comment_id === i.second_comment_id)
                            if(i.comentarios_id === item.second_comment_id){
                                return <p className="reply">&#10148; {item.texto} - <span className="nome_user">{item.username === null ? 'anônimo' :item.username}</span> <span className="responder">REFERENCIAR@</span><br/></p>
                            } 
                        })}</p>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
)
}