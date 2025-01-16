import React, { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import * as web3 from "@solana/web3.js"


const Starter = () => {
    const [balance, setBalance] = useState<number | null>(0)

    const { publicKey } = useWallet()
    const { connection } = useConnection()

    useEffect(() => {
        const getWalletInfo = async () => {
            if (connection && publicKey) {
                const walletAccountInfo = await connection.getAccountInfo(publicKey)
                setBalance(walletAccountInfo!.lamports / web3.LAMPORTS_PER_SOL)
            }
        }

        getWalletInfo()
    }, [connection, publicKey])

    return (
        <main className="min-h-screen text-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] h-60 p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold">account info ✨</h2>
                    </div>

                    <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
                        <ul className="p-2">
                            <li className="flex justify-between">
                                <p className="tracking-wider">Wallet is connected...</p>
                                <p className="text-turbine-green italic font-semibold">
                                    {publicKey ? "yes" : "no"}
                                </p>
                            </li>

                            <li className="text-sm mt-4 flex justify-between">
                                <p className="tracking-wider">Balance...</p>
                                <p className="text-turbine-green italic font-semibold">
                                    {balance}
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Starter;