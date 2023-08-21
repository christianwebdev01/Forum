import React from 'react'
import Montagem from './complemento/Montagem'

export default function Entretenimento(){
    const [postagens, setPostagens] = React.useState([])

    return Montagem('Entretenimento','ent',postagens,setPostagens)
}