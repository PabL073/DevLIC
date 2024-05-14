// import { useEffect, useState } from "react"
// import Web3 from "web3"

// const useWeb3 = () => {
//   const [web3, setWeb3] = useState(null)
//   const [contract, setContract] = useState(null)
//   const [accounts, setAccounts] = useState([])
//   const [entityDetails, setEntityDetails] = useState(null)

//   useEffect(() => {
//     const loadWeb3 = async () => {
//       if (typeof window.ethereum !== "undefined") {
//         const web3Instance = new Web3(
//           Web3.givenProvider || "http://localhost:7545"
//         )
//         setWeb3(web3Instance)

//         const networks = require("../build/contracts/Provenance.json").networks
//         const networkId = await web3Instance.eth.net.getId()
//         const address = networks[networkId]?.address

//         if (address) {
//           const ABI = require("../build/contracts/Provenance.json").abi
//           const contractInstance = new web3Instance.eth.Contract(ABI, address)
//           setContract(contractInstance)
//         } else {
//           console.error("Contract not deployed to the detected network.")
//         }

//         const fetchedAccounts = await web3Instance.eth.getAccounts()
//         setAccounts(fetchedAccounts)
//       } else {
//         console.error("Ethereum object not found, install MetaMask.")
//       }
//     }

//     loadWeb3()
//   }, [])

//   useEffect(() => {
//     const fetchEntityDetails = async () => {
//       if (web3 && contract && accounts.length > 0) {
//         try {
//           const details = await contract.methods
//             .getEntityDetails(accounts[0])
//             .call()

//           if (details && details.name !== "") {
//             setEntityDetails(details)
//           } else {
//             setEntityDetails(null)
//             console.log("Entity details not found")
//           }
//         } catch (error) {
//           console.error("Error fetching entity details:", error)
//           setEntityDetails(null)
//         }
//       }
//     }

//     fetchEntityDetails()
//   }, [web3, contract, accounts])

//   return { web3, contract, accounts, entityDetails }
// }

// export default useWeb3

// import { useEffect, useState } from "react"
// import Web3 from "web3"

// const useWeb3 = () => {
//   const [web3, setWeb3] = useState(null)
//   const [contract, setContract] = useState(null)
//   const [accounts, setAccounts] = useState([])
//   const [entityDetails, setEntityDetails] = useState(null)

//   useEffect(() => {
//     const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545")
//     if (typeof window.ethereum !== "undefined") {
//       setWeb3(web3Instance)

//       const initWeb3 = async () => {
//         try {
//           const networks =
//             require("../build/contracts/Provenance.json").networks
//           const networkId = await web3Instance.eth.net.getId()
//           const address = networks[networkId]?.address

//           if (address) {
//             const ABI = require("../build/contracts/Provenance.json").abi
//             const contractInstance = new web3Instance.eth.Contract(ABI, address)
//             setContract(contractInstance)
//           } else {
//             console.error("Contract not deployed to the detected network.")
//           }

//           const fetchedAccounts = await web3Instance.eth.getAccounts()
//           setAccounts(fetchedAccounts)
//         } catch (error) {
//           console.error(
//             "Failed to initialize web3, accounts, or contract.",
//             error
//           )
//         }
//       }

//       const handleAccountsChanged = (newAccounts) => {
//         setAccounts(newAccounts)
//         if (newAccounts.length > 0) {
//           fetchEntityDetails(newAccounts[0], contract)
//         } else {
//           console.log("Please connect to MetaMask.")
//         }
//       }

//       window.ethereum.on("accountsChanged", handleAccountsChanged)

//       initWeb3()

//       // Cleanup function to remove the event listener when the component unmounts
//       return () => {
//         window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
//       }
//     } else {
//       console.error("Ethereum object not found, install MetaMask.")
//     }
//   }, [web3, contract]) // Including `web3` and `contract` in dependencies array might cause re-registrations of the event listener which is not ideal, this needs careful handling.

//   const fetchEntityDetails = async (account, contractInstance) => {
//     if (web3 && contractInstance && account) {
//       try {
//         const details = await contractInstance.methods
//           .getEntityDetails(account)
//           .call()
//         if (details && details.name !== "") {
//           setEntityDetails(details)
//         } else {
//           setEntityDetails(null)
//           console.log("Entity details not found.")
//         }
//       } catch (error) {
//         console.error("Error fetching entity details:", error)
//         setEntityDetails(null)
//       }
//     }
//   }

//   return { web3, contract, accounts, entityDetails }
// }

// export default useWeb3

import { useState, useEffect, useCallback, useContext } from "react"
import Web3 from "web3"

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null)
  const [contract, setContract] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [entityDetails, setEntityDetails] = useState(null)

  useEffect(() => {
    console.log("Web3: ", entityDetails)
  }, [entityDetails])

  useEffect(() => {
    console.log("Web3Contract: ", contract)
  }, [contract])

  useEffect(() => {
    const loadWeb3AndContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(
          Web3.givenProvider || "http://localhost:7545"
        )
        setWeb3(web3Instance)

        const networks = require("../build/contracts/Provenance.json").networks
        const networkId = await web3Instance.eth.net.getId()
        const address = networks[networkId]?.address

        if (address) {
          const ABI = require("../build/contracts/Provenance.json").abi
          const contractInstance = new web3Instance.eth.Contract(ABI, address)
          setContract(contractInstance)
        } else {
          console.error("Contract not deployed to the detected network.")
        }

        const fetchedAccounts = await web3Instance.eth.getAccounts()
        setAccounts(fetchedAccounts)
      } else {
        console.error("Ethereum object not found, install MetaMask.")
      }
    }

    loadWeb3AndContract()
  }, [])

  useEffect(() => {
    if (contract && accounts.length > 0) {
      fetchEntityDetails(accounts[19])
    }
  }, [contract, accounts]) // Reacting to changes in contract or accounts to fetch details

  const handleAccountsChanged = useCallback(
    async (newAccounts) => {
      if (newAccounts.length > 0) {
        setAccounts(newAccounts)
        await fetchEntityDetails(newAccounts[0]) // Fetching details whenever accounts change
      } else {
        console.log("Please connect to MetaMask.")
      }
    },
    [contract, entityDetails]
  )

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      //console.log("DETAAAILS:", entityDetails)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [handleAccountsChanged])

  const fetchEntityDetails = useCallback(
    async (account) => {
      if (web3 && contract && account) {
        try {
          const details = await contract.methods
            .getEntityDetails(account)
            .call()

          if (details && details.name !== "") {
            setEntityDetails(details)
          } else {
            setEntityDetails(null)
            console.log("Entity details not found.")
          }
        } catch (error) {
          console.error("Error fetching entity details:", error)
          setEntityDetails(null)
        }
      }
    },
    [web3, contract]
  )

  // const removeEntityDetails = useCallback(
  //   (newEntityDetails) => {
  //     console.log("Before updating entity details: ", entityDetails)
  //     //setEntityDetails(null)
  //     console.log("Attempted to update entity details to: ", newEntityDetails)
  //   },
  //   [entityDetails]
  // )

  return {
    web3,
    contract,
    accounts,
    entityDetails,
    setEntityDetails,
  }
}

export default useWeb3
