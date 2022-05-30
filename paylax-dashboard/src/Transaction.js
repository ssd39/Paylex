import React from "react";
import styled from "styled-components";
import Dashboard from "./Component/Dashboard";
import Sidebar from "./Component/Sidebar";
import Message from "./Component/Message";
import relax from "./img_avatar.png"
import './transaction.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BiBorderRadius, BiColumns } from "react-icons/bi";
import { useState } from "react";
import { useEffect } from "react";
export default function Transaction() {
    const [current,setCurrent] = useState("")
    const [data,setData] = useState([])
    const [users,setUsers] = useState([])
    const reptiles = ['a', 'dfs', 'sdf', "dsf", "fdlf", "slf", "sdfj", "dlfk","sdf","fsdf","sfd"]
   
    useEffect( () => {
       console.log("hoi")
    })

    async function getData() {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=10`
        )
      let res = await response.json()
        return res
      }
    
      

    let fetchmaster = async () => {
        console.log(current)
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_limit=${current}`
          )
        let res = await response.json()
          return res

    }
   
    return (

        <div style={{ display: "flex", direction: "column", height: "100%", width: "100%", backgroundColor: "black" }}>
            <Sidebar linkcurrent="4" />
            <div style={{ marginLeft: "25%", marginTop: "7%", height: "70%", width: "70%",overflowY:"scroll", flexDirection: "row", display: "flex",borderRadius:"3%", justifyContent: "center" ,backgroundColor:"#212121"}}>


            <div style={{ height:"100%",width:"100%",display: "flex",flexDirection:"column" ,flexShrink: 0 }}>
                    {reptiles.map((reptile) => (
                        <article class="card">"
                            <div style={{height:"100%",width:"100%"}}>
                              <h1 style={{textAlign:"center"}} class="card_title">50$</h1>
                              </div>
                            <div class="card_content">
                                <h3>Dwij Patel</h3>
                               
                                <p class="card_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                                <span class="card_subtitle">ssd39</span>
                            </div>
                        </article>
                    ))}
                    </div>


            </div>


        </div>
    );
}

const Div = styled.div`
  position: relative;
  overflow:hidden;
`;
