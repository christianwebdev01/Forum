import { Link } from "react-router-dom";
import Nav from "./Nav.jsx";


export default function Start(){

   return(
      <div className="division">
             <div className="boards">
      <h2>Boards:</h2>
      <ul>
         <li><Link to={'/boards/tec?r=tec'}>/tecnologia</Link></li>
         <li><Link to={'/boards/pol?r=pol'}>/politica</Link></li>
         <li><Link to={'/boards/ent?r=ent'}>/entretenimento</Link></li>
         <li><Link to={'/boards/al?r=al'}>/aleatório</Link></li>
         <li><Link to={'boards/fin?r=fin'}>/finanças</Link></li>
      </ul>
    </div>

<div className="div_main_flex">
<Nav/>
    <div className="intro_start">
      <h2>Sobre o projeto</h2>
      <p>
         Essa é uma introdução ao <b>Nexus</b>, uma plataforma social baseada em boards.
         Um ambiente livre com postagens que se medem por upvotes e downvotes com cada invíduo podendo publicar sua opnião de acordo com o conteúdo de cada board. <b>Se você é um recrutador, pode encontrar informações sobre o app em <span className="mark">/Recruiter(Construção)</span></b>
      </p>
    </div>
    <div className="search">
      <input className="caixa" placeholder="&#128270; Pesquise por posts - Titulo"/>
      <p style={{color: 'green'}}>--Query dos 10 ultimos posts(desenvolvimento)</p>
    </div>

</div>
</div>
   )
}