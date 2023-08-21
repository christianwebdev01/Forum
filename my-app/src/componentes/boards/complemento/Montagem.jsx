import React, { useState, useEffect } from "react";
import Fetch from './Fetch'
import Tempo from './Tempo'
import Parse from './Parse'
import { Link } from "react-router-dom";
import Votos from './Votos'
import header from "../../Header";

export default function Montagem(comunidade, sigla) {
    const [alerta,setAlerta] = useState('')
    const [up,setUp] = useState({})
    const [classe,setClasse] = useState({})
    const [tudo_pronto_pra_render,setTudoProntoPraRender] = React.useState(0)
    const [position_saved,setPosition_saved] = useState(window.scrollY)
    
    async function fetch_voto(){
        const config = {
            method: 'POST',
            headers: header,
            credentials: 'include',
            body: JSON.stringify({tokenJWT: localStorage.getItem('tokenJWT') ,voto: up})
        }
        const res = await fetch("http://localhost/projeto-forum/php/upvotes.php",config)
        const dado = await res.json()
        if(dado.erro)setAlerta(dado.erro)
        console.log(dado)
    }

    //Limite de renderizações
    const MAX_RENDERS = 1;

    //Incremento de render para uma segunda render(Motivo: atualizar relação do usuário com post -upvote,downvote)
    const [renderCount, setRenderCount] = useState(0);

     //Dispara um re-render ao votar(clicando), fazendo um fetch com os novos valores de votos no DB
    const [load, setLoad] = useState();

    useEffect(() =>{
       if(renderCount < MAX_RENDERS){
        setTimeout(() => {
            setPostsRenderizados([]);
            setLoad(new Date());
            setRenderCount( prev => prev + 1)
            setTudoProntoPraRender(1)
        },800)
        //suficiente para carregar relações
       }
    },[renderCount])

    //Ao fazer update, volta para a posição vertical onde o usuario se encontrava
    useEffect(()=>{
        console.log('pos '+position_saved)
        setTimeout(()=>{
            //impede que a rolagem aconteça na segundo update
            position_saved > 1030.4000244140625 && window.scrollTo(0, position_saved)
        },1000)
    },[load])

    const [dado, setDado] = useState([]);
    const [postsRenderizados, setPostsRenderizados] = useState([]);

    
    //Fetch que contém as postagens no DB e seus metadados
    useEffect(() => {
        fetch_voto()
        Fetch(comunidade).then((data) => {
            setDado(data);
        });
    }, [load]);

    useEffect(() => {
        const renderizarPosts = async () => { 
            const posts = await Promise.all(
                dado.map(async function(item) {
                
                    //Pega data da postagem e atual para dizer à quantas horas/dias foi feita
                    const itens_data_diff = Tempo(item);
                    const data1 = Parse(item.data);
                    const data2 = Parse(itens_data_diff[0]);
                    const d_diff = (data2 - data1) / (1000 * 60 * 60 * 24);

                    //diz se a data de hoje e do post são a mesma
                    let valido = null;
                    if (item.data === itens_data_diff[0]) {
                        valido = 1;
                    } else {
                        valido = 0;
                    }
                    
                    const totals = {}
                    const dados = await Votos(item.postagens_id);

                        for (const item of dado) {
                            const dados = await Votos(item.postagens_id);
                            const votos = dados.msg;
                            totals[item.postagens_id] = votos; // Armazena o total de upvotes e sua id de post
                        }
                        
                         const id = String(item.postagens_id);

                         //define a relação entre usuario e post(qual voto está registrado,se houver)
                         const rel = dados.rel.valor
     
                         const relNum = parseInt(rel)

            //relação-rel define a classe que o input que renderiza o voto terá
                    if (relNum === 1) {
                        setClasse(prevClasse => ({
                            ...prevClasse,
                            [id]: { down: 'neutro', up: 'clicou_up' }
                        }));
                    } else if (relNum === -1) {
                        setClasse(prevClasse => ({
                            ...prevClasse,
                            [id]: { down: 'clicou_down', up: 'neutro' }
                        }));
                    } else if(relNum === 0) {
                        setClasse(prevClasse => ({
                            ...prevClasse,
                            [id]: { down: 'neutro', up: 'neutro' }
                        }));
                    }

                    //Seta a id do post e a relação com usuario à um objeto
                    setUp(prev => {
                        const atual = {...prev}
                        atual[id] = rel;
                        return atual
                    })

                    //Ao dar upvote:
                    function handleClick(ev) {
                        
                       if(!alerta){
                        if(classe[id]){
                            setPosition_saved(prev => {
                                const atual = window.scrollY
                                console.log('atual')
                                return atual
                            })
                            if(classe[id].up === 'clicou_up'){
                                setClasse({...classe, [id]: {down: 'neutro', up:  'neutro' }})
                                setClasse(prev => ({
                                    ...prev, [id]: {down: 'neutro', up: 'e'}
                                }))
                            } else{
                                setClasse({...classe, [id]: {down: 'neutro', up:  'clicou_up' }})
                            }
                        }else{
                            setClasse({...classe, [id]: {down: 'neutro', up:  'clicou_up' }})
                        }
 
                        setPostsRenderizados([]);
                        setLoad(new Date()); // Atualiza o estado "load" para forçar o novo fetch

                        //insere no objeto o valor do voto dado que varia de acordo com o antigo
                        setUp(prevUp => {
                            const updatedState = { ...prevUp };
                            if (Object.keys(updatedState).includes(id)) {
                                updatedState[id] = updatedState[id] === 1 ? 0 : 1;
                            } else {
                                //cria no obj a id com valor de downvote
                                updatedState[id] = 1;
                            }
                            return updatedState;
                        });
                       }
                    }

                    //ao clicar em downvote
                    function downvote(){
                        //console.log(window.scrollY)
                        //salvando posição vertical ao clicar no voto:
                       if(!alerta){
                        setPosition_saved(prev => {
                            const atual = window.scrollY
                            return atual
                        })
                        if(classe[id]){
                            if(classe[id].down === 'clicou_down'){
                                setClasse({...classe,[id]: {up: 'neutro', down:'neutro'}})
                            } else {
                                setClasse({...classe,[id]: {up: 'neutro', down: 'clicou_down'}})
                            }
                        }else{
                            setClasse({...classe,[id]: {up: 'neutro', down: 'clicou_down'}})
                        }

                        setPostsRenderizados([]);
                        setLoad(new Date()); 

                        setUp(prev => {
                            const atual = {...prev}
                            if (Object.keys(atual).includes(id)) {
                                atual[id] = atual[id] === -1 ? 0 : -1;
                            }else {
                                atual[id] = -1;
                            }
                            return atual
                        })
                       }
                    }
                    
                    return(
                        <div className='post_box'>
                            {valido === 0 && `Postado a ${d_diff} Dias`}
                            {(valido === 1) && (itens_data_diff[1] !== 0) ? `Postado a ${itens_data_diff[1]} horas` : ''}
                            {(valido === 1) && (itens_data_diff[1] === 0) ? "Postado a alguns minutos": ''}
                        <Link to='/report' className="reportar">Reportar</Link>
                        <h1 className='titulo_post'>{item.title}</h1>
                        <p className='bio_post' >{item.texto}</p>
                        {item.imagem && <img className='img_post' src={`data:image/png;base64,${item.imagem}`}/>}
                        <br></br>
                        <br></br>
                        <button 
                        data-id={id}
                        className={classe[id] ? classe[id].up : (totals[id] >= 1) ? 'green' : (totals[id] < 0) ? 'red' : ''} 
                        onClick={handleClick}>{totals[id]}</button>
                        <button onClick={downvote} className={classe[id] && classe[id].down}>DOWN</button>
                        <br></br>
                        <span className='feito_por_post'>Feito por - {item.username}</span><br/>
                            </div>
                    )
                })
            );
                
                setPostsRenderizados([...postsRenderizados, ...posts])
        };
        renderizarPosts();
     
    }, [dado]);

    
    return (
        <div className={comunidade}>
            <Link to={`/boards/submit/${comunidade}?voltar=${sigla}`}>Criar post</Link>
            <div className='container_post'>
                {alerta && <span className="alerta">MODO VIEW:<br></br>{alerta}*</span>}
                {tudo_pronto_pra_render === 1 ? postsRenderizados : <h1 className="carregando">Carregando...</h1>}
            </div>
        </div>
    );
}