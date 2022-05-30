import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';

const url = "https://paylex.herokuapp.com";

let navigation = null;

function setNavigation(nav){
    navigation = nav;
}

async function getCheckoutId(amount){
    try{
        let user_data = await AsyncStorage.getItem('user_data')
        user_data = JSON.parse(user_data)
        let jwt = user_data['jwt']
        console.log(jwt)
        let req = await fetch(`${url}/deposit`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'JWT':jwt
            },
            body: JSON.stringify({
                amount
            })
        })
        let res_json = await req.json()
        console.log(res_json)
        if(res_json.status){
            return res_json['data']['checkout_id']
        }else{
            if(res_json['message']=="404"){
                await auth().signOut()
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("SplashScreen")
            }
        }
    }catch(e){
        console.error(e)
    }
    return ""
}

async function logIn(idToken){
    try{
        let req = await fetch(`${url}/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                idToken
            })
        })
        let res_json = await req.json()
        if(res_json.status){
            await AsyncStorage.setItem('user_data', JSON.stringify(res_json['data']))
            return "done"
        }
    }catch(e){
        console.error(e)
    }
    return ""
}


async function getPayment(paymentId){
    try{
        let user_data = await AsyncStorage.getItem('user_data')
        user_data = JSON.parse(user_data)
        let jwt = user_data['jwt']
        let req = await fetch(`${url}/get_payment`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'JWT':jwt
            },
            body: JSON.stringify({
                paymentId
            })
        })
        let res_json = await req.json()
        if(res_json.status){
            return res_json['data'];
        }else{
            if(res_json['message']=="404"){
                await auth().signOut()
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("SplashScreen")
            }else{
                Snackbar.show({
                    text: res_json['message'],
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("Home")
            }
        }
    }catch(e){
        console.error(e)
    }
    return ""
}

async function confirmPayment(paymentId){
    try{
        let user_data = await AsyncStorage.getItem('user_data')
        user_data = JSON.parse(user_data)
        let jwt = user_data['jwt']
        let req = await fetch(`${url}/confirm_payment`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'JWT':jwt
            },
            body: JSON.stringify({
                paymentId
            })
        })
        let res_json = await req.json()
        if(res_json.status){
            let tokenId =  await auth().currentUser.getIdToken(/* forceRefresh */ true)
            logIn(tokenId)
            return res_json['data'];
        }else{
            if(res_json['message']=="404"){
                await auth().signOut()
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("SplashScreen")
            }else{
                Snackbar.show({
                    text: res_json['message'],
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("Home")
            }
        }
    }catch(e){
        console.error(e)
    }
    return ""
}


async function getTransaction(){
    try{
        let user_data = await AsyncStorage.getItem('user_data')
        user_data = JSON.parse(user_data)
        let jwt = user_data['jwt']
        let req = await fetch(`${url}/usertrans`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'JWT':jwt
            }
        })
        let res_json = await req.json()
        if(res_json.status){
            return res_json['data']
        }else{
            if(res_json['message']=="404"){
                await auth().signOut()
                Snackbar.show({
                    text: 'Authentication Failed.',
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("SplashScreen")
            }else{
                Snackbar.show({
                    text: res_json['message'],
                    duration: Snackbar.LENGTH_SHORT,
                });
                navigation.replace("Home")
            }
        }
    }catch(e){
        console.error(e)
    }
    return ""
}



export { getCheckoutId, logIn,setNavigation, getPayment, confirmPayment, getTransaction }