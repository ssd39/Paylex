import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Animated,
    Easing,
    Image
} from 'react-native';
import LottieView from 'lottie-react-native';


const SwipePayWindow = ({status})=>{

    let elementOpacity = new Animated.Value(0);

    useEffect(()=>{
        if(status==1 || status==2){
            Animated.timing(elementOpacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
        }
    },[status])

    return(
        <View style= {{'backgroundColor':'white', flex:1, alignItems:'center',justifyContent:'center'}}>
            {status==0 && <View style={{ justifyContent:'center', alignItems:'center'}}>
             <LottieView  style={{ width:'70%'}} source={require('../lottie/waiting.json')} loop autoPlay/>
                <Text style={styles.headerFont}>Verifying Payment</Text>
            </View>}
            {status==1 && <View style={{ justifyContent:'center', alignItems:'center'}}>
                <LottieView  style={{ width:'70%', top:-20}} source={require('../lottie/confetti.json')} loop autoPlay/>
                <Image style={{flex:1, resizeMode:'contain',position:'absolute'}} source={require('../images/0001-0180.gif')} />
                <LottieView  style={{ width:'70%'}} source={require('../lottie/sucess.json')} loop={false} autoPlay/>
            </View>}
            {status==2 && <Animated.View style={{opacity: elementOpacity,justifyContent:'center', alignItems:'center'}}>
             <LottieView  style={{ width:'70%', transform:[{scaleX:1.5},{scaleY:1.5}]}} source={require('../lottie/failed.json')} loop autoPlay/>
                <Text style={{...styles.headerFont,color:'#eb4034'}}>Payment failed</Text>
            </Animated.View>}
        </View>
    )
}

const styles = StyleSheet.create({
   
    leftLottie:{
        height:64
    },
    headerFont:{
        fontFamily:'Muli-Bold',
        fontSize:32,
        color:'black',
        marginTop:15,
        alignSelf:'center'
    }
});

export default SwipePayWindow;