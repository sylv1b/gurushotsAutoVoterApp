import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUser = async (user) => {
    try {
        const userString = JSON.stringify(user);
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
            return JSON.parse(user)
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
        return true
    } catch (e) {
        return false
    }
}
