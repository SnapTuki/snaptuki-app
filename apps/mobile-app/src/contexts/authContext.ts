import { createContext } from 'react';
import { LoginCredentials, UserWithToken } from '../types/__generated__/graphql';

interface AuthenticationContext {
    signIn: (credentials: LoginCredentials) => void;
    signOut: () => void;
    user: UserWithToken | null;
    session?: String | null | undefined;
    isLoading: boolean;
}
const AuthContext = createContext<AuthenticationContext | undefined>(undefined);

export default AuthContext;