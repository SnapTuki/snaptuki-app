import { createContext } from "react";


export interface CARE_SERVICE {
    id: number;
    title: string;
}

export interface CareServiceType {

    selectedServices: CARE_SERVICE[];
    //Actions
    addService: (serviceObj: CARE_SERVICE) => void;
    removeService: (serviceId: number) => void;
}

const CareServiceContext = createContext<CareServiceType | undefined>(undefined);

export default CareServiceContext;
