import { ethers } from "ethers";
import Abi from "./abi.json";

export const getNftContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_contract_address,
        Abi,
        providerOrSigner
    );
