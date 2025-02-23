import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"
import tokenabi from "./ABI/token.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0xDFeAAB3b097a8c00C3a886f8D57Da5ba6D711ab5',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const TokenABI = tokenabi;

export const indexer = "https://indexer.dev.hyperindex.xyz/43fd84f/v1/graphql"
export const RPC = "https://eth-sepolia.public.blastapi.io"