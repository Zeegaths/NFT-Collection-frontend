import React, { useState } from "react";
import { Box, Button, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import { ethers } from "ethers";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import AppTabs from "./component/AppTabs";
import useCollections from "./hooks/useCollections";
import useMyNfts from "./hooks/useMyNfts";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import useHandleMint from "./hooks/useMintFunction";

configureWeb3Modal();

function App() {
    const tokensData = useCollections();
    const myTokenIds = useMyNfts();

    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState(""); // State for recipient address

    console.log("token data: ", tokensData);

    const myTokensData = tokensData.filter((x, index) =>
        myTokenIds.includes(index)
    );

    const handleMint = useHandleMint();

    const addr = import.meta.env.VITE_contract_address;
    const address = String(addr).toLowerCase();

    const { userAddress } = useWeb3ModalAccount();

    const handleTransfer = () => {
        // Add your transfer logic here
        // You can use ethers.js or any other library to perform the transfer
        console.log("Transfer initiated to:", recipientAddress);
        // Close the modal after transfer
        setTransferModalOpen(false);
    };

    return (
        <Container>
            <Header />
            <main className="mt-6">
                <AppTabs
                    MyNfts={
                        <Flex align="center" gap="8" wrap={"wrap"}>
                            {myTokensData.length === 0 ? (
                                <Text>No NFT owned yet</Text>
                            ) : (
                                myTokensData.map((x, index) => (
                                    <Box key={x.dna} className="w-[20rem]">
                                        <img
                                            src={x.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                            className="w-full object-contain"
                                            alt={x.name}
                                        />
                                        <Text className="block text-2xl">
                                            Name: {x.name}
                                        </Text>
                                        <Text className="block">
                                            Description: {x.description}
                                        </Text>

                                        <Button className="px-8 py-2 text-xl mt-2">
                                            <a href={`https://testnets.opensea.io/assets/mumbai/${address}/${index}`} target="_blank" rel="noopener noreferrer">
                                                View on OpenSea
                                            </a>
                                        </Button>

                                        <Button className="px-8 py-2 text-xl mt-2" onClick={() => {
                                            setSelectedToken(x);
                                            setTransferModalOpen(true);
                                        }}>
                                            Transfer
                                        </Button>
                                    </Box>
                                ))
                            )}
                        </Flex>
                    }
                    AllCollections={
                        <Flex align="center" gap="8" wrap={"wrap"}>
                            {tokensData.length === 0 ? (
                                <Text>Loading...</Text>
                            ) : (
                                tokensData.map((x, index) => (
                                    <Box key={x.dna} className="w-[20rem]">
                                        <img
                                            src={x.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                                            className="w-full object-contain"
                                            alt={x.name}
                                        />
                                        <Text className="block text-2xl">
                                            Name: {x.name}
                                        </Text>
                                        <Text className="block">
                                            Description: {x.description}
                                        </Text>
                                        {myTokenIds.includes(index) ? (
                                            <Button className="px-8 py-2 text-xl mt-2">
                                                Transfer
                                            </Button>
                                        ) : (
                                            <Button className="px-8 py-2 text-xl mt-2" onClick={() => { handleMint(address, index) }}>
                                                Mint
                                            </Button>
                                        )}
                                    </Box>
                                ))
                            )}
                        </Flex>
                    }
                />
            </main>

            {transferModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Transfer Token</h2>
                        <p className="mb-4">Enter the recipient's address:</p>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 mb-4"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <Button onClick={() => setTransferModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleTransfer}>Transfer</Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default App;
