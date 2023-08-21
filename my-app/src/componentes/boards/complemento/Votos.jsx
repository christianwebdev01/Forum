//Separar upvotes das outras queries.
//Fazer com que voto.jsx retorno upvotes total e botões

import Config from "./Config"

export default function Votos(postagens_id){

    const config = Config('POST', postagens_id)
    async function fetchData(){
     const res = await fetch('http://localhost/projeto-forum/php/upvotes.php?upvotes_total=1', config)
     const dados = await res.json()
        return dados
    }
    return fetchData()
    
}
