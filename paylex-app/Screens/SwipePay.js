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
import SwipeAmount from '../component/SwipeAmount';
import SwipePayWindow from '../component/SwipePayWindow';

import SliderSwipe from '../component/SliderSwipe';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { getPayment, confirmPayment } from '../utils/network';

const SwipePay = (propsData)=>{
    const [index, setIndex] = useState(1);
    const [showProgress, setProgress ] = useState(true)
    const [isSucess, setIsSucess ] = useState(0)
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [confirm, setConfirm] = useState(false)

    useEffect(()=>{
        (async ()=>{
            let paymentId = propsData.route.params['paymentId']
            let data = await getPayment(paymentId)
            if(data){
                setName(data["from_name"].split(" ")[0])
                setAmount(data["amount"])
                setProgress(false)
            }
        })()
    },[])

    useEffect(()=>{
        (async()=>{
            if(confirm){
                let paymentId = propsData.route.params['paymentId']
                let sts = await confirmPayment(paymentId)
                console.log(sts)
                setIsSucess(sts)

            }
        })()
    },[confirm])

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            {!showProgress &&  <View style={{flex: 1, }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                    <SliderSwipe
                        key={index}
                        index={index}
                        setIndex={setIndex}
                        prev={ false }
                        setConfirm={setConfirm}
                        next={ <SwipePayWindow status={isSucess} />}
                    >
                        <SwipeAmount name={name} amount={amount}/>
                    </SliderSwipe>
            </GestureHandlerRootView>
            </View>}
            {showProgress && <LottieView  style={{ width:'100%',position:'absolute',top:0, bottom:0,left:0,right:0 }} source={require('../lottie/cube_loader.json')} loop autoPlay/>}
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

export default SwipePay;