import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"
import tokenabi from "./ABI/token.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0x585a993dE961FE3CCA4a534dC21b1554c08f82dC',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const TokenABI = tokenabi;

export const indexer = "https://indexer.dev.hyperindex.xyz/b37ba32/v1/graphql"
export const RPC = "https://sleek-bitter-darkness.base-sepolia.quiknode.pro/5e802431a03bf8a0a0b23fdb1cecbed56191d65e"