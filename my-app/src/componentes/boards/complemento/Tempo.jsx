
export default function Tempo(item){

    //Hora atual separada em H-M-S
    const d_atual = new Date().toLocaleDateString()
    const t_atual = new Date().toLocaleTimeString()
    
    const atual_arr = t_atual.split(':');
    const h_atual = atual_arr[0];
    const m_atual = atual_arr[1]; 
    const s_atual = atual_arr[2];
    const atual_sep = new Date(0) //começa 00:00:00
    const H_atual = atual_sep.setUTCHours(h_atual,m_atual,s_atual,0) / (1000 * 60 * 60)

    //H-M-S do item
    const tempo_s = item.split(':')
    const horas = tempo_s[0]
    const minutos = tempo_s[1]
    const segs = tempo_s[2]
    const tempo_sep = new Date(0)
    const H = tempo_sep.setUTCHours(horas,minutos,segs,0) / (1000 * 60 * 60)

    //horas de diferença
    const diff = Math.trunc(H_atual - H);

    return [d_atual,diff]
}