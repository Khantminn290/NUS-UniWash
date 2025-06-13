import { useContext } from 'react'
import { WashingMachineContext } from '../context/WashingMachineContext'


export function useWashingMachine() {
    const context = useContext(WashingMachineContext)

    if (!context) {
        throw new Error("useUser must be used within a WashingMachineProvider")
    }

    return context
}