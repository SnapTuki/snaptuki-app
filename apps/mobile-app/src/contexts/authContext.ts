import { createContext } from 'react';
import { LoginCredentials, User,  } from '../types/__generated__/graphql';

interface AuthenticationContext {
    signIn: (credentials: LoginCredentials) => void;
    signOut: () => void;
    user: User | null;
    session?: String | null | undefined;
    isLoading: boolean;
}
const AuthContext = createContext<AuthenticationContext | undefined>(undefined);

export default AuthContext;