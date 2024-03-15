import { useEffect } from "react";
import { ethers } from "ethers";

const useERC721EventListener = (provider, address, setMyTokenIds) => {
  useEffect(() => {
    const fetchEvents = async () => {
      if (!provider || !address) return;

      const erc721Interface = new ethers.utils.Interface([
        // Include your ERC721 event ABI here
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        // Add more event ABIs as needed
      ]);

      const contract = new ethers.Contract(address, erc721Interface, provider);

      // Listen for Transfer events
      contract.on("Transfer", (from, to, tokenId) => {
        if (to.toLowerCase() === address.toLowerCase()) {
          // Token transferred to connected address
          setMyTokenIds((prevIds) => [...prevIds, tokenId.toString()]);
        } else if (from.toLowerCase() === address.toLowerCase()) {
          // Token transferred from connected address
          setMyTokenIds((prevIds) => prevIds.filter((id) => id !== tokenId.toString()));
        }
      });

      // Remove listener when component unmounts
      return () => {
        contract.removeAllListeners("Transfer");
      };
    };

    fetchEvents();

  }, [provider, address]);
};

export default useERC721EventListener;
