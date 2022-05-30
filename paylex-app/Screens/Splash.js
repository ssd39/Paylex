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
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { logIn,setNavigation } from '../utils/network';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () =>{

    let leftMargin1 = new Animated.Value(-250);
    let rightMargin1 = new Animated.Value(220);
    let leftMargin2 = new Animated.Value(-295);
    let rightMargin2 = new Animated.Value(310);
    let leftMargin3 = new Animated.Value(-270);
    let bottomMargin1 = new Animated.Value(60);
    let logoOpacity = new Animated.Value(1);
    let flowOpacity = new Animated.Value(0);
    const navigation = useNavigation();
    const [showLogo , setShowLogo] = useState(true)
    const [showProgress, setProgress] = useState(false)

    const animationIN1 = () => {
        Animated.timing(leftMargin1, {
            toValue: 15,
            duration: 1200,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        Animated.timing(rightMargin1, {
            toValue: -15,
            duration: 1300,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        Animated.timing(leftMargin2, {
            toValue: 15,
            duration: 1300,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        Animated.timing(rightMargin2, {
            toValue: -15,
            duration: 1400,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        Animated.timing(leftMargin3, {
            toValue: 15,
            duration: 1500,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        Animated.timing(bottomMargin1, {
            toValue: -50,
            duration: 1000,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(flowOpacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
    };

    const animationOUT1 = () => {
        Animated.timing(leftMargin1, {
            toValue: -250,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(rightMargin1, {
            toValue: 300,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(leftMargin2, {
            toValue: -295,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(rightMargin2, {
            toValue: 310,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(leftMargin3, {
            toValue: -270,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
        Animated.timing(bottomMargin1, {
            toValue: 60,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
        Animated.timing(flowOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.exp,
            useNativeDriver: true
        }).start();
    };

    const logoOut = () => {
        Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 400,
            easing: Easing.quad,
            useNativeDriver: true
        }).start();
    }

    useEffect( ()=>{

        (async()=>{
        //startup task
            GoogleSignin.configure({
                webClientId: '980491025054-3972ag9m0u5a25am7ps4aeiasocj680r.apps.googleusercontent.com',
            });

            setNavigation(navigation)
            if(auth().currentUser){
                let tokenId =  await auth().currentUser.getIdToken(/* forceRefresh */ true)
                let loginRes = await logIn(tokenId)
                if(loginRes==""){
                    await auth().signOut()
                    Snackbar.show({
                        text: 'Authentication Failed.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    setShowLogo(false)
                }else{
                    let user_data = await AsyncStorage.getItem("user_data")
                    user_data = user_data ? JSON.parse(user_data) : null;
                    if(user_data){
                        if(user_data['deposit']==-1){
                            navigation.replace('NewLogin');
                        }else{
                            navigation.replace('Home'); 
                        }
                    }  
                }   
            }else{
                setTimeout(()=>{
                    logoOut();
                    setTimeout(()=>{
                        setShowLogo(false)
                    },410)
                },1500) 
        }})()
        //dummy time out
    },[])

    useEffect(()=>{
        if(!showLogo){
            animationIN1();
        }
    },[showLogo])

    useEffect(()=>{
        if(!showProgress && !showLogo){
            animationIN1();
        }
    },[showProgress])
        
    async function onAuthStateChanged(user) {
        try{
            if(!user){
                setProgress(false)
                return;
            }
            let idToken = await auth().currentUser.getIdToken(/* forceRefresh */ true)
            let loginRes = await logIn(idToken)
            if(loginRes==""){
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                setProgress(false)
                return;
            }
            let user_data = await AsyncStorage.getItem("user_data")
            user_data = user_data ? JSON.parse(user_data) : null;
            if(user_data){
                if(user_data['deposit']==-1){
                    navigation.replace('NewLogin');
                }else{
                    navigation.replace('Home'); 
                }
            }else{
                
                Snackbar.show({
                    text: 'Error please login again.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                setProgress(false)
            }

        }catch(e){
            setProgress(false)
        }
    }
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const onGoogleButtonPress = async () => {
        try{        
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        
            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
        }catch(e){
            console.error(e)
            setProgress(false)
            return null;
        }
      }

    return(
        <SafeAreaView style={styles.backgroundStyle}>
        <StatusBar backgroundColor={'black'} />
            {!showLogo && !showProgress && (<Animated.View  style={{opacity:flowOpacity}}>
                <Image style={styles.flowImg} source={require('../images/flow.png')} />
            </Animated.View>)}
            {!showLogo &&  !showProgress && (<View style={{flex:1,marginTop:30}}>
                <Animated.View style={{ transform: [{ translateX: leftMargin1 }]}}>
                    <Text style={styles.dottedText}>New Way to pay</Text>
                </Animated.View> 
                <Animated.View style={{ top: 15, transform: [{ translateX: rightMargin1 }], alignSelf:'flex-end'}}>
                    <Text style={styles.dottedText}>Earn Best Rewards</Text>
                </Animated.View> 
                <Animated.View style={{top:30, transform: [{ translateX: leftMargin2 }]}}>
                    <Text style={styles.dottedText}>No hidden charges</Text>
                </Animated.View>
                <Animated.View style={{ top: 45,transform: [{ translateX: rightMargin2 }], alignSelf:'flex-end'}}>
                    <Text style={styles.dottedText}>One swipe checkout</Text>
                </Animated.View>
                <Animated.View style={{top:60,transform: [{ translateX: leftMargin3 }]}}>
                    <Text style={styles.dottedText}>Best Finance Friend</Text>
                </Animated.View>
            </View>)}
            {showLogo && (<Animated.View style={{...styles.centerLogoContainer,opacity: logoOpacity}}>
                <Image style={styles.logoImageContainer} source={require('../images/logofinal.gif')} />
            </Animated.View>)}
       
            {!showLogo && !showProgress && (<View style={{ justifyContent:'flex-end', alignItems:'center'}}>
                <Animated.View  style={{transform: [{ translateY: bottomMargin1 }]}}>
                    <TouchableOpacity style={styles.gsignIn}  disabled={showProgress} onPress={()=>{
                        
                        animationOUT1();
                        setTimeout(()=>{
                            setProgress(true)
                            onGoogleButtonPress()
                            //navigation.replace('NewLogin');
                            //navigation.replace('Home');
                        },220)
                    }}>
                        <Image style={{height:28, width:28}} source={require('../images/gico.png')} />
                        <Text style={styles.gsignInText}>Sign in with Google</Text>           
                    </TouchableOpacity>
                </Animated.View>
            </View>)}
            {showProgress && <LottieView  style={{ width:'100%',position:'absolute',top:0, bottom:0,left:0,right:0 }} source={require('../lottie/cube_loader.json')} loop autoPlay/>}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
      backgroundColor: 'black',
      flex:1
    },
    flowImg:{
        width:'98%',
        alignSelf:'center',
        resizeMode:'contain'
    },
    gsignIn:{
        backgroundColor:'white',
        padding:10,
        borderRadius:30,
        paddingHorizontal:15,
        flexDirection:'row'
    },
    gsignInText:{
        fontSize:18,
        color:'black',
        marginLeft:16
    },
    centerLogoContainer:{
      alignItems:'center',
      justifyContent:'center',
      flex:1
    },
    logoImageContainer:{
        width:'50%',
        maxWidth:  300,
        resizeMode:'contain'
    },
    dottedText:{
        fontFamily:'Movie-Star',
        color:'white',
        fontSize:34
    }
  });

export default SplashScreen;