import React from 'react'
import Montagem from './complemento/Montagem'

export default function Tecnologia(){
    const [postagens, setPostagens] = React.useState([])
   return Montagem('Tecnologia','tec',postagens,setPostagens)
}