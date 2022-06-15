import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';



export const setUser = async (user) => {
    try {
        const userString = JSON.stringify(user);
        axios.defaults.headers.common['x-token'] = user.token;
        await AsyncStorage.setItem('@user', userString)
        return user
    } catch (e) {
        console.log(e)
    }
}

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('@user')
        if (user !== null) {
            const userObject = JSON.parse(user)
            axios.defaults.headers.common['x-token'] = userObject.token;
            return userObject
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}

export const deleteUser = async () => {
    try {
        await AsyncStorage.removeItem('@user')
        axios.defaults.headers.common['x-token'] = null;
        return true
    } catch (e) {
        return false
    }
}

export const setupAxios = async () => {
    let userAgent = 'GuruShotsIOS/2.11.6 (com.gurushots.app; build:519; iOS 15.5.0) Alamofire/5.0.0-rc.2';
    let appVersion = Platform.OS === 'ios' ? '2.11.6' : '5.20.1'
    let apiVersion = '20'

    const headers = {
        'host': 'api.gurushots.com',
        'accept': '*/*',
        'x-device': Platform.OS === 'ios' ? 'iPhone' : 'Android',
        'x-requested-with': 'XMLHttpRequest',
        'x-model': DeviceInfo.getDeviceId(),
        'accept-language': 'en-US',
        'x-api-version': apiVersion,
        'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
        'x-env': Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        'user-agent': userAgent,
        'x-app-version': appVersion,
        'connection': 'keep-alive',
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'x-brand': DeviceInfo.getBrand(),
    }
    axios.defaults.headers.common = headers
    axios.defaults.baseURL = 'https://api.gurushots.com/rest_mobile/'

    return axios
}