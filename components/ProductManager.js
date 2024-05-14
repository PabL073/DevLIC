import React, { useState, useEffect } from "react"
import useWeb3 from "../hooks/useWeb3"
import { useUser } from "../context/EntityData"
import LoadingSpinner from "./LoadingSpinner"

function ProductManager({ onBack }) {
  const { user, updateUser } = useUser()
  const { contract, accounts } = useWeb3()
  const [serialNo, setSerialNo] = useState("")
  const [productName, setProductName] = useState("")
  const [productList, setProductList] = useState([])
  const [productDetails, setProductDetails] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [hoveredItem, setHoveredItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedSerial, setSelectedSerial] = useState(null)

  useEffect(() => {
    fetchProducts() // Fetch products when the component mounts or when contract changes
  }, [contract])

  const fetchProducts = async () => {
    setLoading(true)
    if (contract) {
      try {
        const serialNumbers = await contract.methods
          .getAllProductSerialNumbers()
          .call()
        setProductList(serialNumbers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    console.log("dsdsds: ", productDetails)
  }

  const handleViewDetails = async (serial) => {
    setLoading(true)
    try {
      const details = await contract.methods.getProductDetails(serial).call()
      setProductDetails(details)
      setViewMode("details")
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch product details:", error)
      alert("Failed to fetch product details: " + error.message)
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (accounts.length === 0) {
      alert("No connected accounts")
      return
    }
    setLoading(true)
    try {
      await contract.methods
        .addProduct(serialNo, productName, [], [])
        .send({ from: user[0], gas: 3000000 })
      alert("Product added successfully!")
      fetchProducts()
      setViewMode("list")
    } catch (error) {
      console.error("Failed to add product:", error)
      alert("Failed to add product: " + error.message)
    }
    setLoading(false)
  }

  const showAddProductForm = () => {
    setViewMode("add")
  }

  const showAllProducts = () => {
    setViewMode("list")
    fetchProducts()
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
      marginTop: "16px",
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "transform 0.3s ease-in-out, background-color 0.3s ease",
    },
    buttonHover: {
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
      backgroundColor: "#333333", // Changed to dark gray
      borderRadius: "6px",
      transition: "background-color 0.3s, transform 0.3s",
      display: "flex",
      // center the text in the item

      justifyContent: "space-between",
      alignItems: "center",
    },
    listItemHover: {
      backgroundColor: "#474747", // Slightly lighter gray on hover
      transform: "translateX(5px)",
    },
  }

  return (
    <div style={style.container}>
      <div style={style.textCenter}>
        <div style={style.textLarge}>Product Manager</div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {viewMode === "add" && (
              <>
                <p style={{ color: "#666" }}>
                  Enter product details below and click "Add Product".
                </p>
                <input
                  style={style.input}
                  placeholder='Serial Number'
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                />
                <input
                  style={style.input}
                  placeholder='Product Name'
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <button
                  style={{
                    marginRight: "10px",
                    ...style.button,
                    ...(hoveredItem === "add" ? style.buttonHover : {}),
                  }}
                  onClick={handleAddProduct}
                  onMouseEnter={() => setHoveredItem("add")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Add Product
                </button>
                <button
                  style={{
                    //add space between buttons
                    marginLeft: "10px",
                    ...style.button,
                    ...(hoveredItem === "backToList" ? style.buttonHover : {}),
                  }}
                  onClick={showAllProducts}
                  onMouseEnter={() => setHoveredItem("backToList")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  ← Back to List
                </button>
              </>
            )}

            {viewMode === "list" && (
              <>
                <p style={{ color: "#666", marginTop: "10px" }}></p>
                <button
                  onClick={showAddProductForm}
                  style={{
                    ...style.button,
                    ...(hoveredItem === "add" ? style.buttonHover : {}),
                  }}
                  onMouseEnter={() => setHoveredItem("add")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Add New Product
                </button>

                {productList.length > 0 ? (
                  <ul
                    style={{
                      ...style.list,
                      marginTop: "10px",
                    }}
                  >
                    {productList.map((serial) => (
                      <>
                        <li
                          key={serial}
                          onClick={() => {
                            handleViewDetails(serial)
                            setSelectedSerial(serial)
                          }}
                          style={{
                            ...style.listItem,
                            ...(hoveredItem === serial
                              ? style.listItemHover
                              : {}),
                          }}
                          onMouseEnter={() => setHoveredItem(serial)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {serial}
                        </li>
                      </>
                    ))}
                  </ul>
                ) : (
                  <p>No products found.</p>
                )}
              </>
            )}

            {viewMode === "details" && productDetails && (
              <>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    style={{
                      color: "#666",
                      fontSize: "18px",
                      fontWeight: "bold",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                    }}
                  >
                    Product Details: {selectedSerial}
                  </p>
                  <div
                    style={{
                      textAlign: "left",
                      color: "#333",
                      paddingTop: "10px",
                    }}
                  >
                    <p style={{ marginBottom: "5px" }}>
                      Product Name: {productDetails[0]}
                    </p>
                    <p style={{ marginBottom: "5px" }}>
                      Manufactured By: {productDetails[2]}
                    </p>
                    <p style={{ marginBottom: "5px" }}>
                      Contains: {productDetails[3].join(", ")}
                    </p>
                    <p style={{ marginBottom: "5px" }}>
                      Product Roadmap: {productDetails[4].join(", ")}
                    </p>
                  </div>
                </div>

                <button
                  style={{
                    ...style.button,
                    ...(hoveredItem === "backToList" ? style.buttonHover : {}),
                  }}
                  onClick={showAllProducts}
                  onMouseEnter={() => setHoveredItem("backToList")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  ← Back to List
                </button>
              </>
            )}
          </>
        )}
      </div>
      <button
        style={{
          ...style.button,
          ...(hoveredItem === "back" ? style.buttonHover : {}),
        }}
        onClick={onBack}
        onMouseEnter={() => setHoveredItem("back")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Back
      </button>
    </div>
  )
}

export default ProductManager
