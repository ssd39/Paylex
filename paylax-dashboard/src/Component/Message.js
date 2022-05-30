import React from "react";
import styled from "styled-components";

function ReptileList() {
    const reptiles = ["alligator", "snake", "lizard"];
  
    return (
      <ol>
        {reptiles.map((reptile) => (
          <li>{reptile}</li>
        ))}
      </ol>
    );
  }
  


export default function Message() {
    const reptiles = ["alligator", "snake", "lizard"];
    return(
   <section>



    <div className="PersonName">
    {reptiles.map((reptile) => (
          <li style={{color:"white"}}>{reptile}</li>
        ))}
    </div>
    <div className="chats" style={{display:"flex",flexDirection:"column"}}>
        <div className="person">
            <h1 style={{color:"white"}}>hfd</h1>
        </div>
        <div className="chat">
            <h1>fjsk</h1>
        </div>
    </div>
    </section>
    )
}

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
 
`;
