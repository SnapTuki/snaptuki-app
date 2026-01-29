import { useContext } from "react"
import CareServiceContext from "../contexts/careServiceContext"

export const useSelectedServices = () => {
    const context = useContext(CareServiceContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}