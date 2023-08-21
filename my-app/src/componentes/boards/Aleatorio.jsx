import React from 'react'
import Montagem from './complemento/Montagem'

export default function Aleatorio(){
    const [postagens, setPostagens] = React.useState([])
    return Montagem('Aleatorio','al',postagens,setPostagens)
}