import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Animated,
    Easing,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Linking
} from 'react-native';
import TopUpAmount from '../component/TopUpAmount';
import DepositPay from '../component/DepositePay';
import Slider from '../component/Slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const TopUp = ()=>{
    const [index, setIndex] = useState(1);
    const [allowToPay, setAllowToPay] = useState(false)
    const [checkout_id, setCheckOutId] = useState("")

    let elemetnOpacity = new Animated.Value(0);

    const animationIn = ()=>{
        Animated.timing(elemetnOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    }

    useEffect(()=>{
        animationIn()
    },[])

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            <Animated.View style={{flex: 1, opacity:elemetnOpacity}}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                    <Slider
                        key={index}
                        index={index}
                        setIndex={setIndex}
                        prev={ false }
                        next={allowToPay && <DepositPay checkout_id={checkout_id} />}
                    >
                        <TopUpAmount startRapydPayment={setCheckOutId} goNext={setAllowToPay}/>
                    </Slider>
            </GestureHandlerRootView>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
      backgroundColor: 'black',
      flex:1
      
    },
    nextButton:{
        backgroundColor:'white',
        borderRadius:40,
        alignSelf:'center',
        marginTop:35
    },  
    leftLottie:{
        height:64
    },
    headerFont:{
        fontFamily:'Muli-Bold',
        color:'white',
        fontSize:32,
        alignSelf:'flex-start'
    },
    infoFont:{
        fontFamily:'Muli-Bold',
        color:'white',
        fontSize:14,
        lineHeight:14,
        alignSelf:'flex-start',
        marginTop:40
    }
});

export default TopUp;