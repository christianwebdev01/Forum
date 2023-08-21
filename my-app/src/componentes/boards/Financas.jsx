import React from 'react'
import Montagem from './complemento/Montagem'

export default function Financas(){
    const [postagens, setPostagens] = React.useState([])
    return Montagem('Financas','fin',postagens,setPostagens)
}