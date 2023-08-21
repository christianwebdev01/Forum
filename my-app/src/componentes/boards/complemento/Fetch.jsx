import header from "../../Header"
export default async function Fetch(comunidade){
    

    const res = await fetch("http://localhost/projeto-forum/php/posts.php",{
        method: 'POST',    
        headers: header,
        credentials: 'include',
        body: JSON.stringify({comunidade: comunidade})
    })
    const dado = await res.json()
    return dado.POSTAGENS
}