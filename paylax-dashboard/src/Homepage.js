import logo from './logo.svg';
import './App.css';
import Header from './Component/Homepage/header'
import relaxxi from './relaxx.png'
import checkout from './checkout.png'
import collect from './collect.png'
import retention from './retention.png'
import userfriendly from './userfriendly.png'
import { motion } from 'framer-motion';
import './Component/Homepage/variant';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

import GoogleButton from 'react-google-button';
import { emoji, emojii, emojiii, emojiiii, emojiwrap, fadeInUp, mobilewrap } from './Component/Homepage/variant';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Homepage() {
    const navigate = useNavigate();

    const [showloginButton, setShowloginButton] = useState(true);
    const [showlogoutButton, setShowlogoutButton] = useState(false);
    const onLoginSuccess = async (ress) => {
        console.log(ress)
        let data = {
            idToken:ress.credential
        }
        console.log('Login Success:', data);
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
        
            },
           body: JSON.stringify(data)
        };
        
        let res = await fetch("http://localhost:5000/loginadmin",settings)
        res = await res.json()
        console.log(res)
        localStorage.setItem('jwt',res.data.jwt)
        navigate("/dashboard")
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    const onSignoutSuccess = () => {
        alert("You have been logged out successfully");
        console.clear();
        setShowloginButton(true);
        setShowlogoutButton(false);
    };
    return (
        <GoogleOAuthProvider clientId="980491025054-3972ag9m0u5a25am7ps4aeiasocj680r.apps.googleusercontent.com">;

        <div className="App">
            <Header></Header>
            <div class="circle">
                <div class="circles">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                </div>
                <div class="circles2">
                    <div class="circle1"></div>
                    <div class="circle2"></div>
                    <div class="circle3"></div>
                </div>
            </div>
            <motion.img src={relaxxi} variants={mobilewrap} initial="initial" animate="animate" className="Imagee"></motion.img>

            <motion.div className="animatedemoji" variants={emojiwrap} initial="initial" animate="animate">
                <motion.img src={collect} className="imgdd" variants={emojiiii} initial="initial" animate="animate"></motion.img>
                <motion.img src={retention} className="imgd" variants={emojiii} initial="initial" animate="animate"></motion.img>

                <motion.img src={userfriendly} className="imgdd" variants={emojii} initial="initial" animate="animate"></motion.img>
                <motion.img src={checkout} className="imgd" variants={emoji} initial="initial" animate="animate"></motion.img>


            </motion.div>
            <div>

                <motion.div className="texthype" variants={fadeInUp} initial="initial" animate="animate">
                    <h1>Join the fastest growing <br></br> payment network</h1>

                    <div>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                onLoginSuccess(credentialResponse)
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />;
                    </div>

                </motion.div>


            </div>

        </div>
        </GoogleOAuthProvider>
    );
}
