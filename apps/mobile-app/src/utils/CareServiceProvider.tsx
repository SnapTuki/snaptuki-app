import { PropsWithChildren, useState } from "react";
import CareServiceContext from "../contexts/careServiceContext";

export const CareServiceProvier = ({ children }: PropsWithChildren) => {
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    const addService = (serviceId: number) => {
        setSelectedServiceIds((prev) => {
            if (prev.includes(serviceId)) return prev;
            return [...prev, serviceId];
        });
    };

    const removeService = (serviceId: number) => {
        setSelectedServiceIds((prev) => prev.filter((id) => id !== serviceId));
    };

    return (
        <CareServiceContext.Provider value={{selectedServiceIds, addService, removeService}}>
            {children}
        </CareServiceContext.Provider>
    )
}