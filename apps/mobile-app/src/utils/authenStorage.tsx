import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
    namespace: string;
    constructor(namespace = 'auth') {
        this.namespace = namespace;
    }

    async getAccessToken() {
        // Get the access token for the storage
        const token = await AsyncStorage.getItem(`${this.namespace}:token`);
        return token;
    }

    async setAccessToken(accessToken: string) {
        await AsyncStorage.setItem(`${this.namespace}:token`, accessToken)
    };

    async removeAccessToken() {
        await AsyncStorage.removeItem(`${this.namespace}:token`);
    }
}

export default AuthStorage;