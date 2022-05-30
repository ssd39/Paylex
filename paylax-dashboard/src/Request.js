import React from "react";
import styled from "styled-components";
import Dashboard from "./Component/Dashboard";
import Sidebar from "./Component/Sidebar";
import Message from "./Component/Message";
import relax from "./img_avatar.png"
import dummy from "./dummy.jpg"
import close from "./close.png"
import './transaction.css'
import QRCode from "react-qr-code";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BiBorderRadius, BiColumns } from "react-icons/bi";
import { useState } from "react";
import { useEffect } from "react";
import "./Form.css"
import { MdLteMobiledata } from "react-icons/md";
export default function Request() {
    const [current, setCurrent] = useState("")
    const [data, setData] = useState([])
    const [users, setUsers] = useState([])
    const [price, setPrice] = useState("1$")
    const [description, setDescription] = useState()
    const reptiles = ['a', 'dfs', 'sdf', "dsf", "fdlf", "slf", "sdfj", "dlfk", "sdf", "fsdf", "sfd"]

    useEffect(() => {
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

    function onClose(){
       console.log("here")
    }
    return (

        <div style={{ display: "flex", direction: "column", height: "100%", width: "100%", backgroundColor: "black" }}>
            <Sidebar linkcurrent="4" />
            <div style={{ marginLeft: "25%", marginTop: "7%", height: "70%", width: "70%", flexDirection: "row", display: "flex", borderRadius: "3%", justifyContent: "center", backgroundColor: "#212121" }}>


                <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div className="form">
                        <form onSubmit={(e) => {
                                    e.preventDefault(); 
                                document.getElementById("popup-outer").style.display = "flex"
                            }} >
                            <label>

                                <input type="text" style={{ fontSize: "70px" }} className="price" name="price" value={price} onChange={e => {
                                    console.log(e)
                                    let price = e.target.value.replace("$", "")

                                    setPrice(price + "$")
                                }} />
                                <input type="text" style={{ fontSize: "15px" }} value={description} className="description" name="description" onChange={e => {
                                    console.log(e)

                                    setDescription(e.target.value)
                                }} />

                            </label>
                            <input class="submit" type="submit" value="Request" />
                        </form>
                    </div>
                </div>


            </div>

            <div class="popup-outer" id="popup-outer">
                <div class="square" id="popup-inner">
                    <img src={close} onClick={() => {
                    document.getElementById("popup-outer").style.display= "none"
                    }} style={{ position: "absolute", marginBottom: "29%", marginLeft: "24%", height: "20px", width: "20px" }}></img>
                    <h3 style={{ color: "white", marginBottom: "-10px   " }}>Complete your payment</h3>
                    <h1 style={{ color: "#ffc107" }}>{price}</h1>
                    <div style={{ background: 'white', padding: '16px' }}>
    <QRCode value={price} size="128" />
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
