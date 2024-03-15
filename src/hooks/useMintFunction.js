import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getNftContract } from "../constants/contracts";

const useHandleMint = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(
        async (address, tokenId) => {
            if (!isSupportedChain(chainId))
                return console.error("Wrong network");
            const readWriteProvider = getProvider(walletProvider);
            const signer = await readWriteProvider.getSigner();

            const contract = getNftContract(signer);

            try {
                const transaction = await contract.safeMint(address, tokenId, {value:"100000000000000"});
                console.log("transaction: ", transaction);
                const receipt = await transaction.wait();

                console.log("receipt: ", receipt);

                if (receipt.status) {
                    return console.log("Mint successfull");
                   
                }

                console.log("Failed to mint");
            } catch (error) {
                console.log(error);
                let errorText;
                if (error.reason === "Not enough minting fee") {
                    errorText = "Insufficient gas fees";               
                } else {
                    errorText = "An unknown error occured";
                }
                console.error("error: ", errorText);                
            }
        },
        [chainId, walletProvider]
    );
};

export default useHandleMint;