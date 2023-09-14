import header from "../../Header";
export default function Config(method,dados){
    if(dados){
        const config = {
            method: method,
            headers: header,
            credentials: 'include',
            body: JSON.stringify({dado: dados})
        }    
        return config
    } else{
        const config = {
            method: method,
            headers: header,
            credentials: 'include'
        }
        return config
    }

}