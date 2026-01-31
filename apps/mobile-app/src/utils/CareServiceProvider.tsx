import { PropsWithChildren, useState } from "react";
import CareServiceContext from "../contexts/careServiceContext";
import { CARE_SERVICE } from "../contexts/careServiceContext";

export const CareServiceProvier = ({ children }: PropsWithChildren) => {
    const [selectedServices, setSelectedServices] = useState<CARE_SERVICE[]>([]);

    const addService = (serviceObj: CARE_SERVICE) => {
        setSelectedServices((prev) => {
            if (prev?.includes(serviceObj)) return prev;
            return [...prev, serviceObj];
        });
    };

    const removeService = (serviceId: number) => {
        setSelectedServices((prev) => prev?.filter((serviceObj) => serviceObj.id !== serviceId));
    };

    return (
        <CareServiceContext.Provider value={{selectedServices, addService, removeService}}>
            {children}
        </CareServiceContext.Provider>
    )
}