import ABI from "./ABI/bondingCurve.json";
import ercABI from "./ABI/ERC20.json"
import tokenabi from "./ABI/token.json"

export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
export const BondingCurve = {
    contractAddress: '0x904184a85a9f1708130F6DA4E6121Fe5De544A93',
    ABI: ABI,
}
export const ERC20ABI = ercABI;
export const TokenABI = tokenabi;

export const indexer = "https://indexer.dev.hyperindex.xyz/debca94/v1/graphql"
export const RPC = "https://sleek-bitter-darkness.base-sepolia.quiknode.pro/5e802431a03bf8a0a0b23fdb1cecbed56191d65e"