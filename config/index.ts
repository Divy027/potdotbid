import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0x1539360c6c61DDa27653f826640E55AF92EbfF91',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const indexer = "https://indexer.dev.hyperindex.xyz/b42398f/v1/graphql"