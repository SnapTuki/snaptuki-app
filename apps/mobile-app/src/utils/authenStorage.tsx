import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
    namespace: string;
    constructor(namespace = 'auth') {
        this.namespace = namespace;
    }

    getAccessToken() {
        // Get the access token for the storage
        const token = AsyncStorage.getItem(`${this.namespace}:token`);
        return token;
    }

    setAccessToken(accessToken: string) {AsyncStorage.setItem(`${this.namespace}:token`, accessToken)};

    removeAccessToken() {
       AsyncStorage.removeItem(`${this.namespace}:token`);
    }
}

export default AuthStorage;