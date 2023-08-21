import React from 'react'
import Montagem from './complemento/Montagem'

export default function Politica(){
    const [postagens, setPostagens] = React.useState([])
  
    return Montagem('Politica','pol',postagens,setPostagens)
}