
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
import QRCodeScanner from 'react-native-qrcode-scanner';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useNavigation } from '@react-navigation/native';

const ScanQR = ()=>{
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor={'black'} />
            <QRCodeScanner
                reactivate={false}
                showMarker={true}
                onRead={(e)=>{
                    const options = {
                        enableVibrateFallback: true,
                        ignoreAndroidSystemSettings: false
                    };
                    ReactNativeHapticFeedback.trigger("impactMedium", options);
                    navigation.replace("SwipePay",{  paymentId: e.data})
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
      backgroundColor: 'black',
      flex:1
    }
});

export default ScanQR;