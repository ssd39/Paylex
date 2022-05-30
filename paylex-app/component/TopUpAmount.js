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
import auth from '@react-native-firebase/auth';
import { logIn } from '../utils/network';

const TopUpAmount = ({goNext,startRapydPayment})=>{

    let [txtVal, setTxtVal] = useState("")
    let [depAmnt, setDepAmnt] = useState("")

    const [showProgress, setProgress ] = useState(true)

    useEffect(()=>{
        (async ()=>{
            let tokenId =  await auth().currentUser.getIdToken(/* forceRefresh */ true)
            let loginRes = await logIn(tokenId)
            if(loginRes==""){
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                return            
            }
            let user_data = await AsyncStorage.getItem('user_data')
            user_data = JSON.parse(user_data)
            let spent = parseInt(user_data['spent'])
            setDepAmnt(spent)
            if(spent==0){
                setTxtVal("No topup required!")
            }else{
                let chekout_id = await getCheckoutId(spent)
                
                startRapydPayment(chekout_id)
                goNext(true)
                setTxtVal("That's great decision!")
            }
            setProgress(false)

        })()
    },[])

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            {!showProgress && <View style={{flex:1, paddingHorizontal:40, justifyContent:'center'}}>
                <Text style={styles.headerFont}>
                    {txtVal}
                </Text>
                {depAmnt!=0 && <Text style={{...styles.infoFont,        lineHeight:16}}>
                    <Text style={{color:'#74f1fc'}} >Swipe Left </Text>
                        to top-up of <Text style={{color:'#118C4F'}} >{depAmnt}$ </Text> 
                </Text>}
            </View>}
            {!showProgress && <LottieView  loop={false} style={{ width:'100%',bottom:-2 }} source={require('../lottie/lf20_swbkzxz0.json')} autoPlay/>}
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

export default TopUpAmount;