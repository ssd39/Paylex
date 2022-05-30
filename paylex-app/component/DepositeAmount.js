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
    Linking,
    Keyboard
} from 'react-native';
import { Input, Spinner } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { getCheckoutId } from '../utils/network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DepositeAmount = ({goNext,startRapydPayment})=>{

    let pg1Opacity = new Animated.Value(1);

    let [txtVal, setTxtVal] = useState("")
    let [depAmnt, setDepAmnt] = useState("")
    let [disabelBtn, setDisableBtn] = useState(false)

    let [pg2, setPg2] = useState(false)


    let animationOut = ()=>{
        Animated.timing(pg1Opacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
        setTimeout(()=>{
            
            setTxtVal("That's Amazing!")
            goNext(true)
            setPg2(true)
        },210)
    }

    useEffect(()=>{
        (async ()=>{
            let user_data = await AsyncStorage.getItem("user_data")
            user_data = JSON.parse(user_data)
            setTxtVal(`Hi, ${user_data['name'].split(" ")[0]}`)
        })()
    },[])

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            <View style={{flex:1, paddingHorizontal:40, justifyContent:'center'}}>
                <Text style={styles.headerFont}>
                    {txtVal}
                </Text>
                {pg2 && (<Text style={{...styles.infoFont,        lineHeight:16}}>
                    <Text style={{color:'#74f1fc'}} >Swipe Left </Text>
                        to make deposit of <Text style={{color:'#118C4F'}} >{depAmnt}$ </Text> 
                </Text>)}
                {!pg2 && (<Animated.View style={{opacity:pg1Opacity}}>
                    <Text style={{...styles.infoFont}}>
                        Get your credit limit and pay faster along with earning intrest and rewards by depositing.  
                        <Text style={{...styles.infoFont,color:'blue'}} onPress={() => Linking.openURL('http://google.com')}> Learn More</Text>
                    </Text>
                
                    <Input
                        placeholder='Deposit Amount ($)'
                        keyboardType={'numeric'}
                        style={{borderColor:'white', backgroundColor:'black', marginTop: 20}}
                        onChangeText={setDepAmnt}
                        value={depAmnt.toString()}
                        disabled={disabelBtn} 
                    />
                    <TouchableOpacity style={{...styles.nextButton}} onPress={async ()=>{
                        const options = {
                            enableVibrateFallback: true,
                            ignoreAndroidSystemSettings: false
                        };
                        
                        ReactNativeHapticFeedback.trigger("impactMedium", options);
                        if(parseFloat(depAmnt)>0){
                            Keyboard.dismiss()
                            setDisableBtn(true)
                            let chekout_id = await getCheckoutId(depAmnt)
                            if(chekout_id==""){
                                setDisableBtn(false)
                                return;
                            }
                            startRapydPayment(chekout_id)
                            animationOut();
                        }
                        
                        
                    }}>
                        
                        {!disabelBtn && (<Image style={{height:32, width:32}}  source={require('../images/right-chevron.png')}/>)}
                        {disabelBtn && (<LottieView   style={{height:16, width:16,transform: [{ scaleX: 2.2},{scaleY: 2.2 }], justifyContent:'center', alignSelf:'center', margin:5}} source={require('../lottie/loader.json')} loop autoPlay/>)}
                    </TouchableOpacity>
                    
                </Animated.View>)}
            </View>
            <LottieView  loop={false} style={{ width:'100%',bottom:-2 }} source={require('../lottie/lf20_swbkzxz0.json')} autoPlay/>
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
        marginTop:35,
        padding:8
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

export default DepositeAmount;