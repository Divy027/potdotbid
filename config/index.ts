import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"
import tokenabi from "./ABI/token.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0x1539360c6c61DDa27653f826640E55AF92EbfF91',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const TokenABI = tokenabi;

export const indexer = "https://indexer.dev.hyperindex.xyz/b42398f/v1/graphql"
export const RPC = "https://sepolia.base.org"