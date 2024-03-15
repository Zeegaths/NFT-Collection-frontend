import { SUPPORTED_CHAIN } from "../connection";
import { getNftContract } from "../constants/contracts";
import { getProvider } from "../constants/providers";

export const isSupportedChain = (chainId) =>
    Number(chainId) === SUPPORTED_CHAIN;

export const getReadWriteBallotContract = async (provider) => {
    const readWriteProvider = getProvider(provider);

    const signer = await readWriteProvider.getSigner();

    return getNftContract(signer);
};
