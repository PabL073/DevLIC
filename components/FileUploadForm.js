import React, { useEffect, useState } from "react"
import { create } from "@web3-storage/w3up-client"
import { useFileUrl } from "../context/FileUrlContext"

const FileUploadForm = () => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const { fileUrl, setFileUrl } = useFileUrl()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFile(file)
      setFileName(file.name)
    } else {
      setFile(null)
      setFileName("")
    }
  }

  useEffect(() => {
    //
  }, [fileUrl])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (file) {
      try {
        // Initialize the Web3.Storage client
        const client = await create()
        // Login to the client
        const account = await client.login("ciolocapaul@yahoo.com")
        // Create a new space
        const space = await client.createSpace("test1_space")

        // Provision the account with the space
        await account.provision(space.did())
        await space.save()

        // Set the current space
        await client.setCurrentSpace(space.did())

        // Create a recovery delegation
        const recovery = await space.createRecovery(account.did())
        await client.capability.access.delegate({
          space: space.did(),
          delegations: [recovery],
        })

        //create array of files
        const files = [file]
        const directoryCid = await client.uploadDirectory(files)
        console.log("Uploaded directory CID:", directoryCid)
        //log directory cid to console as string
        const cid = directoryCid.toString()
        console.log("CID:", cid)

        // set the file URL to the CID
        const url = `https://${cid}.ipfs.w3s.link`
        // console.log("URL:", url)
        setFileUrl(url)

        // console.log("fileURL: ", fileUrl)
        alert(
          "File uploaded successfully! Can be accesed at: " +
            "https://" +
            cid +
            ".ipfs.w3s.link"
        )

        // } catch (error) {
        //   console.error("Error uploading file:", error)
        //   alert("Error uploading file. Please try again later.")
        // }
      } catch (error) {}
    } else {
      alert("No file selected.")
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col p-5 border border-gray-300 shadow-lg rounded-lg bg-white'
      >
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Upload certificate file (PDF):
        </label>
        <input
          type='file'
          onChange={handleFileChange}
          className='block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          mb-3'
        />
        {fileName && (
          <p className='text-gray-600 text-sm italic'>
            File selected: {fileName}
          </p>
        )}
        <button
          type='submit'
          disabled={!file}
          className='mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-300'
        >
          Upload File
        </button>
      </form>
    </div>
  )
}

export default FileUploadForm
