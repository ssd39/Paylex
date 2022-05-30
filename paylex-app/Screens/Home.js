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
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Snackbar from 'react-native-snackbar';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Avatar, Button, Layout, Popover,Divider } from '@ui-kitten/components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getTransaction  } from '../utils/network';
import { ScrollView } from 'react-native-gesture-handler';
const Home = ()=>{
    const navigation = useNavigation();
    const [showProgress, setProgress ] = useState(true)
    const [deposit, setDeposit ] = useState(true)
    const [spent, setSpent ] = useState(true)
    const [popOverVisible, setPepOverVisible ] = useState(false)
    const [transactions, setTransactions ] = useState([])
    useEffect(()=>{
        (async() =>{
            let user_data = await AsyncStorage.getItem('user_data')
            user_data = JSON.parse(user_data)
            setDeposit(parseInt(user_data['deposit']))
            setSpent(user_data['spent'])
            let transactionData = await getTransaction()
            setTransactions(transactionData)
            setProgress(false)
        })()
    },[])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setProgress(true)
            AsyncStorage.getItem('user_data').then((user_data)=>{
                user_data = JSON.parse(user_data)
                setDeposit(parseInt(user_data['deposit']))
                setSpent(user_data['spent'])
                getTransaction().then((data)=>{
                    setTransactions(data)
                    setProgress(false)
                })
        
            })
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

    const touchEffect = ()=>{
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false
        };
        
        ReactNativeHapticFeedback.trigger("impactLight", options);
    }

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            { !showProgress && <LinearGradient colors={[ "#d3cce3", "#e9e4f0"]} style={styles.balBox}>
                <Text style={styles.boxHText2}>Month Spent</Text>
                <Text style={styles.boxHText}>{spent}$ <Text style={{fontSize:12, color:'black'}}>/ {deposit}$</Text></Text>
            </LinearGradient>}
                { !showProgress && <View style={styles.threebtn}>
                    <LinearGradient  colors={[ "#d3cce3", "#e9e4f0"]} style={styles.btnBox}>
                        <TouchableOpacity  onPress={()=>{
                            touchEffect()
                            navigation.push('ScanQR');
                        }}>
                            <Image style={{alignSelf:'center', height:48,width:48}} source={require("../images/scan.png")} />
                            <Text style={styles.boxHText1}>Scan</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient colors={[ "#d3cce3", "#e9e4f0"]} style={styles.btnBox}>
                        <TouchableOpacity onPress={()=>{
                            touchEffect()
                            navigation.push('TopUp');
                        }}>
                            <Image style={{alignSelf:'center', height:42,width:42, marginTop:6}} source={require("../images/invoice.png")} />
                            <Text style={styles.boxHText1}>Topup</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient colors={[ "#d3cce3", "#e9e4f0"]} style={styles.btnBox}>
                    <Popover
                        style={{backgroundColor:'white'}}
                        visible={popOverVisible}
                        anchor={()=>{
                            return (<TouchableOpacity onPress={()=>{
                                touchEffect()
                                setPepOverVisible(true)
                            }}>
                            <Image style={{alignSelf:'center', height:42,width:42, marginTop:6}} source={require("../images/more.png")} />
                                <Text style={styles.boxHText1}>More</Text>
                            </TouchableOpacity>)
                        }}
                            onBackdropPress={() => setPepOverVisible(false)}>
                        <View style={{backgroundColor:'white',borderColor:'white', padding:10, borderRadius:15}}>
                            <TouchableOpacity style={styles.popOverContainer}>   
                                <Image style={{height:22,width:22}} source={require('../images/setting.png')} />
                                <Text style={styles.dropDownText}>Settings</Text>
                            </TouchableOpacity>
                            <Divider style={{backgroundColor:'rgba(1,1,1,0.2)'}} />
                            <TouchableOpacity onPress={async ()=>{
                                touchEffect()
                                setProgress(true)
                                await AsyncStorage.clear()
                                await auth().signOut()
                                await GoogleSignin.revokeAccess()
                                navigation.replace('SplashScreen');
                            }} style={styles.popOverContainer}>   
                                <Image style={{height:22,width:22}} source={require('../images/logout.png')} />
                                <Text style={styles.dropDownText}>Logout</Text>
                            </TouchableOpacity>
                            <Divider style={{backgroundColor:'rgba(1,1,1,0.2)'}} />
                        </View>
                    </Popover>
                        
                    </LinearGradient>
                   
               

                </View>}
                
                {!showProgress && <View style={{flex:1, marginTop:12}}>
                    <Divider style={{backgroundColor:'#c0c6cf', width:'90%', alignSelf:'center'}} />
                    { !showProgress && <ScrollView  style={{ width: '100%', marginTop:10 }} contentContainerStyle={{ flexGrow: 1}}>
                        {
                                transactions.map((val,index)=>{
                                    return(
                                    <View style={{backgroundColor:'white',flexDirection:'row', marginTop: 10, marginHorizontal:25, borderRadius:10, padding:10, justifyContent:"space-between"}} key={index}>
                                        <Text style={styles.listText}>{val['amount']+"$"}</Text>
                                        <Text style={styles.listText}>To: {val['from_name']}</Text>
                                        {val['status'] && <Image  source={require('../images/check.png')}/>}
                                        {!val['status'] && <Image  source={require('../images/failed.png')}/>}
                                    </View>)
                                })
                        }
                        
                        </ScrollView>}
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
    balBox:{
        borderRadius:10,
        width:'80%',
        alignSelf:'center',
        marginTop:20,
        padding:15
    },
    listText:{
        fontSize:20,
        fontFamily:'Muli-Bold',
        color:'black'
    },
    boxHText:{
        fontFamily:'Muli-Bold',
        color:'black',
        fontSize:32,
        color:'#46849e'
        
    },
    boxHText2:{
        fontFamily:'Muli-Bold',
        color:'black',
        fontSize:14,
    },
    boxHText1:{
        fontFamily:'Muli-Bold',
        color:'black',
        fontSize:18,
        alignSelf:'center',
        color:'#46849e'
    },
    threebtn:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignSelf:'center',
        width:'80%',
        height:100,
        marginTop:15    },
    btnBox:{
        borderRadius:10,
        
        flex:1,
        margin: 10
    },
    dropDownText:{
        fontFamily:'Muli-Bold',
        marginLeft:5,
        fontSize:16,
        color:'#46849e'
    },
    popOverContainer:{
        flexDirection:'row',
        alignItems:'center',
        margin:4
    }
});

export default Home;