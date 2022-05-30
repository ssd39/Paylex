import React from "react";
import styled from "styled-components";
import Dashboard from "./Component/Dashboard";
import Sidebar from "./Component/Sidebar";
import Message from "./Component/Message";
import relax from "./img_avatar.png"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BiBorderRadius, BiColumns } from "react-icons/bi";
import { useState } from "react";
import { useEffect } from "react";
import './payments.css'
export default function Payments() {
    const [current,setCurrent] = useState("")
    const [data,setData] = useState([])
    const [users,setUsers] = useState([])
    const reptiles = ['a', 'dfs', 'sdf', "dsf", "fdlf", "slf", "sdfj", "dlfk"]
   
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
            <Sidebar linkcurrent="3" />
            <div style={{ marginLeft: "25%", marginTop: "7%", height: "70%", width: "70%", flexDirection: "row", display: "flex", paddingBottom: "20%", justifyContent: "center" }}>


                <div className="person" style={{ width: "40%",borderRadius:"10%", height: "100%", justifyContent: "center", overflowY: "scroll", scrollbarWidth: "none", backgroundColor: "#212121", marginRight: "40px" }}>
                    <h3 style={{ color: "white", textAlign: "center" }}>Customers</h3>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center" }}>

                        {reptiles.map((reptile) => (
                            <div class="paybox" id={reptile} onClick={() => {
                                fetchmaster()
                                if(current != reptile){
                                    if(current){
                                document.getElementById(current).style.backgroundColor="#212121"
                                    }                               
                             
                                setCurrent(reptile)
                                document.getElementById(reptile).style.backgroundColor="#ffc107"
                                }   
                            }}>
                                <img src={relax} style={{ borderRadius: "50%", height: "50px", width: "50px", }}></img>
                                <h4 style={{ marginLeft: "20px", color: "white" }}>James Robert</h4>
                            </div>

                        ))}



                    </div>
                </div>
                <div className="chat" style={{ width: "60%", height: "100%", textAlign: "center",overflowY:"scroll", backgroundColor: "#212121" ,borderRadius:"10%", scrollbarWidth: "none"}}>
                    <div style={{ display: "flex",flexDirection:"column" }}>
                    {reptiles.map((reptile) => (
                        <article class="cardi">
                                      <h3 class="card_title">50$</h3>
                            <div class="card_content">
                            <h4>Received</h4>
                                <span class="card_subtitle">For Grocery</span>
                                <p class="card_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                            </div>
                        </article>
                    ))}
                    </div>

                </div>


            </div>


        </div>
    );
}

const Div = styled.div`
  position: relative;
  overflow:hidden;
`;
