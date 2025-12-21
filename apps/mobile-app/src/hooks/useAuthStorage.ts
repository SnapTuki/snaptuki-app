import { useContext } from "react";
import AuthStorageContext from "../contexts/authSotrageContext";

const useAuthStorage = () => {
    return useContext(AuthStorageContext);
}

export default useAuthStorage;