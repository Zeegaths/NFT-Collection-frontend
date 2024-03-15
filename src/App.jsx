import React, { useState } from "react";
import { Box, Button, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import AppTabs from "./component/AppTabs";
import useCollections from "./hooks/useCollections";
import useMyNfts from "./hooks/useMyNfts";
import useERC721EventListener from "./hooks/useERC721EventListener"; 

configureWeb3Modal();

function App() {
    const tokensData = useCollections();
    const myTokenIds = useMyNfts();

    console.log("token data: " , tokensData)

    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    

    const myTokensData = tokensData.filter((x, index) =>
        myTokenIds.includes(index)
    );
    console.log("my tokens data:", myTokensData)

    const handleTransfer = (tokenId) => {
        setSelectedToken(tokenId);
        setTransferModalOpen(true);
    };  

    const addr = import.meta.env.VITE_contract_address
    const address = String(addr).toLowerCase()


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

                                        <Button className="px-8 py-2 text-xl mt-2" onClick={() => handleTransfer(x.tokenId)}>
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
                                tokensData.map((x) => (
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
                                            Mint
                                        </Button>
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
                        <input type="text" className="border border-gray-300 rounded-md p-2 mb-4" />
                        <div className="flex justify-between">
                            <Button onClick={() => setTransferModalOpen(false)}>Cancel</Button>
                            <Button>Transfer</Button>
                        </div>
                    </div>
                </div>
            )}
            
        </Container>

    );
}

export default App;
