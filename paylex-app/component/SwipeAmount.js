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
import LottieView from 'lottie-react-native';


const SwipeAmount = ({name,amount})=>{

    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
           <View style={{flex:1, paddingHorizontal:40, justifyContent:'center'}}>
                <Text style={styles.headerFont}>
                    Paying <Text style={{color:'#118C4F'}} >{amount}$ </Text> to <Text style={{color:'#74f1fc'}} >{name}</Text>
                </Text>
               <Text style={{...styles.infoFont, lineHeight:16}}>
                    <Text style={{color:'#74f1fc'}} >Swipe Left </Text> to confirm. 
                </Text>
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

export default SwipeAmount;