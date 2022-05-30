import React, {useEffect, useState} from 'react';
import {
    View,
    ScrollView,
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
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';
import Snackbar from 'react-native-snackbar';

const DepositPay = ({checkout_id})=>{
    const [webRef,setWebRef] = useState(null)
    const [isCompleted,setCompleted] = useState(0)

    useEffect(()=>{
        if(checkout_id!=""){
            console.log("Checkout Id: " + checkout_id)
        }
    },[checkout_id])

    const onMessage = (payload) => {
        let data = JSON.parse(payload.nativeEvent.data);
        if(data['type']=="action"){
            if(data['data']=="start_payment"){
                webRef.injectJavaScript(`window.startPayment("${checkout_id}")`);
            }else if(data['data']=="payment_sucess"){
                console.log("Woha! payment is succeed!")
                setCompleted(1)
                Snackbar.show({
                    text: 'If you are new user your account will be activated in few minuites.',
                    duration: Snackbar.LENGTH_LONG
                });
            }else if(data['data']=="payment_error"){
                console.log("oh! payment is failed!")
                setCompleted(2)
            }
        }else{
            console.log("--> " + data['data'])
        }
      };
    
    return(
        <View style= {{'backgroundColor':'white', flex:1, padding:10}}>
            {isCompleted==0 && checkout_id!="" && (
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ flexGrow: 1}}>
                    <WebView 
                        nestedScrollEnabled
                        domStorageEnabled={true}
                        javaScriptEnabledAndroid={true}
                        originWhitelist={['*']}
                        onMessage={onMessage}
                        source={{uri:'file:///android_asset/rapydCheckoutPage/index.html'}} 
                        ref={r => (setWebRef(r))}
                        scrollEnabled={true}
                    />
            </ScrollView>
            )}
       {isCompleted==1 && <View style={{ justifyContent:'center', alignItems:'center'}}>
                <LottieView  style={{ width:'70%', top:-20}} source={require('../lottie/confetti.json')} loop autoPlay/>
                <Image style={{flex:1, resizeMode:'contain',position:'absolute'}} source={require('../images/0001-0180.gif')} />
                <LottieView  style={{ width:'70%'}} source={require('../lottie/sucess.json')} loop={false} autoPlay/>
            </View>}
            {isCompleted==2 && <View style={{justifyContent:'center', alignItems:'center'}}>
             <LottieView  style={{ width:'70%', transform:[{scaleX:1.5},{scaleY:1.5}]}} source={require('../lottie/failed.json')} loop autoPlay/>
                <Text style={{...styles.headerFont,color:'#eb4034'}}>Payment failed</Text>
            </View>}
            
            
        </View>
    )
}

export default DepositPay;