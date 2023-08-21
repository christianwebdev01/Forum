import header from "../../Header";
export default function Config(method,dados){
    const config = {
        method: method,
        headers: header,
        credentials: 'include',
        body: JSON.stringify({dado: dados})
    }
    return config
}