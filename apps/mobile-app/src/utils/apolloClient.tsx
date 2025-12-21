import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import  Constants  from "expo-constants";
import {SetContextLink} from "@apollo/client/link/context";
import AuthStorage from "./authenStorage";


const createApolloClient = (authStorage: AuthStorage) => {

    const authLink = new SetContextLink(async (prevContext, operation) => {
        try {
            const token = await authStorage.getAccessToken();
            return {
                headers: {
                    ...prevContext.headers,
                    authorization: token ? `Bearer ${token}` : '',
                }
            }

        } catch (error) {
            console.log(error);
            return {
                ...prevContext.headers
            }
        }

    });

    const httpLink = new HttpLink({
    uri: Constants.expoConfig?.extra?.apollo_url || '',
  });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;