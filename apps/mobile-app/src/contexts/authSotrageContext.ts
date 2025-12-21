import { createContext } from "react";
import AuthStorage from "../utils/authenStorage";



const AuthStorageContext = createContext<AuthStorage | undefined>(undefined);

export default AuthStorageContext;
