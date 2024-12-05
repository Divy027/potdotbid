import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0x6d71eB220e32ea3A3a1210339Fa46aE31AAbAa0f',
    ABI: ABI,
}
export const ERC20ABI = ercABI;