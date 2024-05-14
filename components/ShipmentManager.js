import React, { useState, useEffect } from "react"
import useWeb3 from "../hooks/useWeb3"
import { useUser } from "../context/EntityData"
import LoadingSpinner from "./LoadingSpinner"

function ShipmentManager({ onBack }) {
  const { user } = useUser()
  const { contract, accounts } = useWeb3()
  const [serialNo, setSerialNo] = useState("")
  const [productSerialNo, setProductSerialNo] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [location, setLocation] = useState("")
  const [newOwner, setNewOwner] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [viewMode, setViewMode] = useState("list") // 'list', 'add', 'transfer', 'accept'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log("Logged in user: ", user)
  }, [user])

  const handleCreateShipment = async () => {
    if (!contract || accounts.length === 0) {
      setError("No blockchain contract loaded or no account connected.")
      return
    }

    console.log("Adding shipment:", user[0])
    setLoading(true)
    try {
      await contract.methods
        .addShipment(serialNo, productSerialNo, quantity, location)
        .send({ from: user[0] })
      setViewMode("list")
    } catch (error) {
      setError(`Failed to create shipment: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTransferOwnership = async () => {
    if (!contract || accounts.length === 0) {
      setError("No blockchain contract loaded or no account connected.")
      return
    }
    setLoading(true)
    try {
      await contract.methods
        .transferShipmentOwnership(serialNo, newOwner, newLocation)
        .send({ from: accounts[0] })
      setViewMode("list")
    } catch (error) {
      setError(`Failed to transfer ownership: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOwnership = async () => {
    if (!contract || accounts.length === 0) {
      setError("No blockchain contract loaded or no account connected.")
      return
    }
    setLoading(true)
    try {
      await contract.methods
        .acceptShipmentOwnership(serialNo)
        .send({ from: user[0] })
      setViewMode("list")
    } catch (error) {
      setError(`Failed to accept ownership: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMouseEnter = (e) => {
    e.target.style.transform = style.buttonHover.transform
    e.target.style.backgroundColor = style.buttonHover.backgroundColor
  }

  const handleMouseLeave = (e) => {
    e.target.style.transform = "none"
    e.target.style.backgroundColor = style.button.backgroundColor
  }
  const handleFocus = (e) => {
    e.target.style.borderColor = style.inputFocus.borderColor
    e.target.style.boxShadow = style.inputFocus.boxShadow
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = style.input.border
    e.target.style.boxShadow = "none"
  }

  const style = {
    container: {
      padding: "24px",
      maxWidth: "640px",
      margin: "auto",
      backgroundColor: "#f4f4f8",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "transform 0.3s ease-in-out, background-color 0.3s ease",
      marginTop: "10px", // Adds vertical spacing between buttons
    },
    buttonHover: {
      // Note: This needs to be applied on hover via onMouseEnter and onMouseLeave
      transform: "scale(1.05)",
      backgroundColor: "#0056b3",
    },
    input: {
      marginTop: "8px",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #007bff",
      width: "calc(100% - 24px)",
      fontSize: "16px",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    inputFocus: {
      // Note: This needs to be applied on focus
      borderColor: "#0056b3",
      boxShadow: "0 0 8px #0056b3",
    },
    textCenter: {
      textAlign: "center",
    },
    textLarge: {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#262626",
      textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
    },
    list: {
      listStyleType: "none",
      width: "100%",
      maxWidth: "600px",
      maxHeight: "300px",
      overflowY: "auto",
      margin: "0 auto",
    },
    listItem: {
      cursor: "pointer",
      padding: "12px 18px",
      marginTop: "4px",
      backgroundColor: "#333333",
      borderRadius: "6px",
      transition: "background-color 0.3s, transform 0.3s",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listItemHover: {
      backgroundColor: "#474747",
      transform: "translateX(5px)",
    },
  }

  const renderView = () => {
    switch (viewMode) {
      case "add":
        return (
          <>
            <input
              style={style.input}
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder='Shipment Serial Number'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              style={style.input}
              value={productSerialNo}
              onChange={(e) => setProductSerialNo(e.target.value)}
              placeholder='Product Serial Number'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              style={style.input}
              type='number'
              value={quantity}
              onChange={(e) => {
                // Update to handle non-negative numbers only
                const newValue = parseInt(e.target.value, 10)
                if (!isNaN(newValue) && newValue >= 0) {
                  setQuantity(newValue)
                } else if (e.target.value === "") {
                  setQuantity("") // Allow clearing the input
                }
              }}
              placeholder='Quantity'
              onFocus={handleFocus}
              onBlur={handleBlur}
              min='0' // HTML validation to ensure the input cannot be set to a negative number via the interface
            />
            <input
              style={style.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Location'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              style={style.button}
              onClick={handleCreateShipment}
              disabled={loading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Create Shipment
            </button>
            <button
              style={style.button}
              onClick={() => setViewMode("list")}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Back to List
            </button>
          </>
        )
      case "transfer":
        return (
          <>
            <input
              style={style.input}
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder='Shipment Serial Number'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              style={style.input}
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder='New Owner Address'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              style={style.input}
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder='New Location'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              style={style.button}
              onClick={handleTransferOwnership}
              disabled={loading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Transfer Ownership
            </button>
            <button
              style={style.button}
              onClick={() => setViewMode("list")}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Back to List
            </button>
          </>
        )
      case "accept":
        return (
          <>
            <input
              style={style.input}
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder='Shipment Serial Number'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              style={style.button}
              onClick={handleAcceptOwnership}
              disabled={loading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Accept Ownership
            </button>
            <button
              style={style.button}
              onClick={() => setViewMode("list")}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Back to List
            </button>
          </>
        )
      case "list":
      default:
        return (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                style={style.button}
                onClick={() => setViewMode("add")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Create New Shipment
              </button>
              <button
                style={{ ...style.button, marginTop: "10px" }}
                onClick={() => setViewMode("transfer")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Transfer Shipment
              </button>
              <button
                style={{ ...style.button, marginTop: "10px" }}
                onClick={() => setViewMode("accept")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Accept Shipment
              </button>
            </div>
          </>
        )
    }
  }

  return (
    <div style={style.container}>
      <div style={style.textCenter}>
        <div style={style.textLarge}>Shipment Manager</div>
        {loading ? <LoadingSpinner /> : renderView()}
      </div>
      <button
        onClick={onBack}
        style={style.button}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Back
      </button>
    </div>
  )
}

export default ShipmentManager
