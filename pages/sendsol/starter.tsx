import { ExternalLinkIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import * as web3 from "@solana/web3.js"
import { toast } from 'react-toastify';

const Starter = () => {
  const [balance, setBalance] = useState<number>(0)
  const [transactionSignature, SetTransactionSignature] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [account, setAccount] = useState("");

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleTransaction = async () => {
    if (!connection || !publicKey) {
      toast.error("Wallet not found. Please connect your wallet")
      return
    }

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    const transactionInfo = {
      feePayer: publicKey,
      blockhash,
      lastValidBlockHeight
    }

    const transaction = new web3.Transaction(transactionInfo)

    const instruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      lamports: amount * web3.LAMPORTS_PER_SOL,
      toPubkey: new web3.PublicKey(account)
    })

    transaction.add(instruction)

    try {

      const signature = await sendTransaction(transaction, connection)
      SetTransactionSignature(signature)

      const newBalance = balance - amount
      setBalance(newBalance)

    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }
  }


  useEffect(() => {
    const getWalletInfo = async () => {
      if (connection && publicKey) {
        const walletAccountInfo = await connection.getAccountInfo(publicKey)
        setBalance(walletAccountInfo!.lamports / web3.LAMPORTS_PER_SOL)
      }
    }

    getWalletInfo()
  }, [connection, publicKey])

  const outputs = [
    {
      title: "Your aacount balance...",
      dependency: balance
    },
    {
      title: "Transaction signature....",
      dependency: transactionSignature,
      href: `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`,
    }
  ]

  return (
    <main className="min-h-screen text-white max-w-7xl">
      <section className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4">
        <form className="rounded-lg min-h-content p-4 bg-[#2a302f] sm:col-span-6 lg:col-start-2 lg:col-end-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl text-[#fa6ece]">Send Sol 💸</h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleTransaction();
              }}
              disabled={!account || !amount}
              className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] 
                    rounded-lg w-24 py-1 font-semibold transition-all duration-200 
                    hover:bg-transparent border-2 border-transparent hover:border-[#fa6ece]`}
            >
              Submit
            </button>
          </div>
          <div className="mt-6">
            <h3 className="italic text-sm">Address of receiver</h3>
            <input
              id="account"
              type="text"
              placeholder="Public key of receiver"
              className="text-[#9e80ff] py-1 w-full bg-transparent outline-none resize-none border-2 border-transparent border-b-white"
              onChange={(event) => setAccount(event.target.value)}
            />
          </div>
          <div className="mt-6">
            <h3 className="italic text-sm">Number amount</h3>
            <input
              id="amount"
              type="number"
              min={0}
              placeholder="Amount of SOL"
              className="text-[#9e80ff] py-1 w-full bg-transparent outline-none resize-none border-2 border-transparent border-b-white"
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>
          <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
            <ul className="p-2">
              {outputs.map(({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${index !== 0 && "mt-4"
                    }`}
                >
                  <p className="tracking-wider">{title}</p>
                  {dependency && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex text-[#80ebff] italic ${href && "hover:text-white"
                        } transition-all duration-200`}
                    >
                      {dependency.toString().slice(0, 25)}
                      {href && <ExternalLinkIcon className="w-5 ml-1" />}
                    </a>
                   )}
                </li>
              ))}
            </ul>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Starter;