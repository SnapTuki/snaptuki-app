import { createContext } from "react";

export interface CareServiceType {

    selectedServiceIds: number[];
    //Actions
    addService: (serviceId: number) => void;
    removeService: (serviceId: number) => void;
}

const CareServiceContext = createContext<CareServiceType | undefined>(undefined);

export default CareServiceContext;
