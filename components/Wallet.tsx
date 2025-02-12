// import Link from "next/link";
// import { useListen } from "../hooks/useListen";
// import { useMetamask } from "../hooks/useMetamask";
// import { Loading } from "./Loading";

// export default function Wallet() {
//   const {
//     dispatch,
//     state: { status, isMetamaskInstalled, wallet, balance },
//   } = useMetamask();
//   const listen = useListen();

//   const showInstallMetamask =
//     status !== "pageNotLoaded" && !isMetamaskInstalled;
//   const showConnectButton =
//     status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

//   const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

//   const handleConnect = async () => {
//     dispatch({ type: "loading" });
//     const accounts = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     if (accounts.length > 0) {
//       const balance = await window.ethereum!.request({
//         method: "eth_getBalance",
//         params: [accounts[0], "latest"],
//       });
//       dispatch({ type: "connect", wallet: accounts[0], balance });

//       // we can register an event listener for changes to the users wallet
//       listen();
//     }
//   };

//   const handleDisconnect = () => {
//     dispatch({ type: "disconnect" });
//   };

//   const handleAddUsdc = async () => {
//     dispatch({ type: "loading" });

//     await window.ethereum.request({
//       method: "wallet_watchAsset",
//       params: {
//         type: "ERC20",
//         options: {
//           address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//           symbol: "USDC",
//           decimals: 18,
//           image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
//         },
//       },
//     });
//     dispatch({ type: "idle" });
//   };

//   return (
//     <div className="bg-truffle">
//       <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
//         <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
//           <span className="block">Connect your wallet</span>
//         </h2>
//         <p className="mt-4 text-lg leading-6 text-white">
      
//         </p>

//         {wallet && balance && (
//           <div className=" px-4 py-5 sm:px-6">
//             <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
//               <div className="ml-4 mt-4">
//                 <div className="flex items-center">
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium leading-6 text-white">
//                       Address: <span>{wallet}</span>
//                     </h3>
//                     <p className="text-sm text-white">
//                       Balance:{" "}
//                       <span>
//                         {(parseInt(balance) / 1000000000000000000).toFixed(4)}{" "}
//                         ETH
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showConnectButton && (
//           <button
//             onClick={handleConnect}
//             className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
//           >
//             {status === "loading" ? <Loading /> : "Connect Wallet"}
//           </button>
//         )}

//         {showInstallMetamask && (
//           <Link
//             href="https://metamask.io/"
//             target="_blank"
//             className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
//           >
//             Install Metamask
//           </Link>
//         )}

//         {isConnected && (
//           <div className="flex  w-full justify-center space-x-2">
       
//             <button
//               onClick={handleDisconnect}
//               className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
//             >
//               Disconnect
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect } from 'react';
import Link from 'next/link';
import { useListen } from '../hooks/useListen';
import { useMetamask } from '../hooks/useMetamask';
import { Loading } from './Loading';
import { Boxes } from './background-boxes'; 
import useWeb3 from "../hooks/useWeb3";

import {initialValues, useUser} from "../context/EntityData";
import { init } from 'next/dist/compiled/webpack/webpack';


export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask = status !== 'pageNotLoaded' && !isMetamaskInstalled;
  const showConnectButton = status !== 'pageNotLoaded' && isMetamaskInstalled && !wallet;
  const isConnected = status !== 'pageNotLoaded' && wallet;
  const { entityDetails, setEntityDetails} = useWeb3();
  const {user, updateUser} = useUser();

  useEffect(() => { 
    if(entityDetails){
      updateUser(entityDetails);
    }
    else
    {
      updateUser(initialValues);
    }
  }, [entityDetails]);

  useEffect(() => {
    console.log("Wallet2: ",user)
  }
  , [user]);

  const handleConnect = async () => {

    console.log("Connect initiated");
    dispatch({ type: 'loading' });
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        dispatch({ type: 'connect', wallet: accounts[0], balance });
    
        
        listen();
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } 
  };

  const handleDisconnect = async () => {

    dispatch({ type: 'disconnect' });
    //removeEntityDetails();
    //setEntityDetails(null);


    updateUser(initialValues);
  };


  return (
    <div className="relative w-full bg-slate-900 py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Boxes /> {/* Animated Boxes background contained within the Wallet component */}
      </div>
      <div className="z-10 relative w-full max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Connect your wallet
        </h2>
        {wallet && balance && (
          <div className="mt-4 text-white">
            Address: <span>{wallet}</span><br />
            Balance: <span>{(parseInt(balance) / 1e18).toFixed(4)} ETH</span>
          </div>
        )}
        {showConnectButton && (
          <button
            onClick={handleConnect}
            className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white"
          >
            {status === 'loading' ? <Loading /> : 'Connect Wallet'}
          </button>
        )}
        {showInstallMetamask && (
          <Link href="https://metamask.io/" target="_blank">
            <button className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white">
              Install Metamask
            </button>
          </Link>
        )}
        {isConnected && (
          <button
            onClick={handleDisconnect}
            className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useListen } from '../hooks/useListen';
// import { useMetamask } from '../hooks/useMetamask';
// import { Loading } from './Loading';
// import { Boxes } from './background-boxes'; 

// export default function Wallet() {
//   const {
//     dispatch,
//     state: { status, isMetamaskInstalled, wallet, balance },
//   } = useMetamask();
//   const listen = useListen();

//   useEffect(() => {
//     const checkIfWalletIsConnected = async () => {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//         if (accounts.length > 0) {
//           const balance = await window.ethereum.request({
//             method: 'eth_getBalance',
//             params: [accounts[0], 'latest']
//           });
//           dispatch({ type: 'connect', wallet: accounts[0], balance });
//         }
//       } catch (error) {
//         console.error('Could not fetch accounts:', error);
//       }
//     };

//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts) => {
//         if (accounts.length > 0) {
//           dispatch({ type: 'connect', wallet: accounts[0], balance });
//         } else {
//           dispatch({ type: 'disconnect' });
//         }
//       });
//       checkIfWalletIsConnected();
//     }
//   }, [dispatch]);

//   const handleConnect = async () => {
//     dispatch({ type: 'loading' });
//     try {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       if (accounts.length > 0) {
//         const balance = await window.ethereum.request({
//           method: 'eth_getBalance',
//           params: [accounts[0], 'latest']
//         });
//         dispatch({ type: 'connect', wallet: accounts[0], balance });
//       }
//     } catch (error) {
//       console.error('Failed to connect:', error);
//     }
//   };

//   const handleDisconnect = () => {
//     dispatch({ type: 'disconnect' });
//   };

//   return (
//     <div className="relative w-full bg-slate-900 py-16 overflow-hidden">
//       <div className="absolute inset-0 z-0">
//         <Boxes /> {/* Animated Boxes background contained within the Wallet component */}
//       </div>
//       <div className="z-10 relative w-full max-w-4xl mx-auto text-center px-4">
//         <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Connect your wallet</h2>
//         {wallet && (
//           <div className="mt-4 text-white">
//             <p>Address: {wallet}</p>
//             <p>Balance: {(parseInt(balance) / 1e18).toFixed(4)} ETH</p>
//           </div>
//         )}
//         {!wallet && isMetamaskInstalled && (
//           <button
//             onClick={handleConnect}
//             className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white">
//             {status === 'loading' ? <Loading /> : 'Connect Wallet'}
//           </button>
//         )}
//         {!isMetamaskInstalled && (
//           <Link href="https://metamask.io/" target="_blank">
//             <button className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white">
//               Install Metamask
//             </button>
//           </Link>
//         )}
//         {wallet && (
//           <button
//             onClick={handleDisconnect}
//             className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-ganache px-5 py-3 text-base font-medium text-white">
//             Disconnect
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
