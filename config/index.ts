import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"
import tokenabi from "./ABI/token.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0xA83B86519fEfd3E0Cbd617C1B9850842d14Ad779',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const TokenABI = tokenabi;

export const indexer = "https://indexer.dev.hyperindex.xyz/36b50e6/v1/graphql"
export const RPC = "https://sepolia.base.org"