import { createContext } from "react";
import AuthStorage from "../utils/authenStorage";



const AuthStorageContext = createContext<AuthStorage | undefined>(new AuthStorage());

export default AuthStorageContext;
