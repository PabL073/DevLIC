import { useContext } from "react"
import useWeb3, { EthereumContext } from "./useWeb3" // Ensure correct import

const useRegisterEntity = () => {
  const { web3, contract, accounts } = useWeb3()

  const registerEntity = async (
    address,
    role,
    name,
    location,
    certified = 0,
    link
  ) => {
    if (!web3 || !contract || accounts.length === 0) {
      console.error("Web3 not initialized or no account connected")
      return false
    }

    console.log("Registering entity with the following details:")
    console.log("Address:", address)
    console.log("Role:", role)
    console.log("Name:", name)
    console.log("Location:", location)
    console.log("Certified:", certified)
    console.log("Link:", link)

    try {
      const response = await contract.methods
        .registerEntity(address, role, name, location, certified, link)
        .send({ from: accounts[0], gasLimit: 3000000 }) // Using the first account to send the transaction
      // Set the gas limit to 3 million
      console.log("Transaction receipt: ", response)

      return true
    } catch (error) {
      console.error("Error registering entity:", error)
      return false
    }
  }

  return { registerEntity }
}

export default useRegisterEntity
