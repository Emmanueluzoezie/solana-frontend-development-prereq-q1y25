import { AnchorProvider, Program } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Counter } from '../../programs/types/counter';
import CounterIDL from "../../programs/idls/counter.json";
import * as web3 from "@solana/web3.js"

const Starter = () => {
    const [counterKey, setCounterKey] = useState<string>("")
    const [count, setCount] = useState<number>(0)
    const [transactionSignature, SetTransactionSignature] = useState<string>("")

    const {publicKey, wallet } = useWallet()
    const {connection} = useConnection()

    const handleInitializeCounter = () => {

    }

    const handleIncrementCounter = () => {

    }

    const provider = new AnchorProvider(
        connection,
        wallet?.adapter as unknown as NodeWallet,
        AnchorProvider.defaultOptions()
    )

    const counterAppProgram = new Program(
        CounterIDL as unknown as Counter,
        provider,
    )

    const getPreparedTransaction = async() => {
        const { blockhash, lastValidBlockHeight } = await  connection.getLatestBlockhash()

        const transactionInfo = {
            feePayer: publicKey,
            blockhash,
            lastValidBlockHeight
        }

        const transaction = new web3.Transaction(transactionInfo)

        return transaction
    }

    const outputs = [
        {
          title: "Counter value",
          dependency: count
        },
        {
          title: "Latest transaction signature....",
          dependency: transactionSignature,
          href: `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`,
        }
      ]


    return (
        <main className="min-h-screen text-white max-w-7xl">
          <section className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4">
            <form className="rounded-lg min-h-content p-4 bg-[#2a302f] sm:col-span-6 lg:col-start-2 lg:col-end-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl text-[#fa6ece]">
                  Create Counter 💸
                </h2>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleInitializeCounter();
                  }}
                  disabled={!publicKey}
                  className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] 
                    rounded-lg w-auto py-1 font-semibold transition-all duration-200 hover:bg-transparent 
                    border-2 border-transparent hover:border-[#fa6ece]`}
                >
                  Initialize Counter
                </button>
                {counterKey && (
                  <p className="text-sm text-gray-400">Counter Key: {counterKey}</p>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleIncrementCounter();
                  }}
                  disabled={!publicKey || !counterKey}
                  className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] 
                    rounded-lg w-auto py-1 font-semibold transition-all duration-200 hover:bg-transparent 
                    border-2 border-transparent hover:border-[#fa6ece]`}
                >
                  Increment Counter
                </button>
              </div>
              <div className="text-sm font-semibold mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
                <ul className="p-2">
                  {outputs.map(({ title, dependency, href }, index) => (
                    <li
                      key={title}
                      className={`flex justify-between items-center ${
                        index !== 0 && "mt-4"
                      }`}
                    >
                      <p className="tracking-wider">{title}</p>
                      {dependency && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex text-[#80ebff] italic ${
                            href && "hover:text-white"
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