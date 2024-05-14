

// const MyApp = ({ Component, pageProps }: AppProps) => {
//     const [entityDetails, setEntityDetails] = useState(null);
//     const [web3, setWeb3] = useState<Web3 | null>(null);
//     const [contract, setContract] = useState<any>(null);

//     useEffect(() => {
//         const loadBlockchainData = async () => {
//             if (typeof window.ethereum !== 'undefined') {
//                 const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
//                 setWeb3(web3);

//                 const ABI = require('../build/contracts/Provenance.json').abi;
//                 const address = require('../build/contracts/Provenance.json').networks[5777].address;
                
              
//                 const contract = new web3.eth.Contract(ABI, address);
//                 setContract(contract);
//             } else {
//                 console.error("Ethereum object not found, install MetaMask.");
//                 setWeb3(null);
//             }
//         };
//         loadBlockchainData();
//     }, []);

//     useEffect(() => {
//         if (web3 && contract) {
//             const fetchEntityDetails = async () => {
//                 try {
//                     const accounts = await web3.eth.getAccounts();
//                     if (accounts.length > 0) {
//                         const details = await contract.methods.getEntityDetails(accounts[0]).call();
//                         // check if details is empty
//                         if (details.name === '') {
//                             setEntityDetails(null);
//                             return;
//                         }
//                         else {
//                         setEntityDetails(details);
//                         }
//                     } else {
//                         console.log("No account is connected");
//                         setEntityDetails(null);
//                     }
//                 } catch (error) {
//                     console.error("Error fetching entity details:", error);
//                     setEntityDetails(null);
//                 }
//             };
//             fetchEntityDetails();
//         }
//     }, [web3, contract]);

 
//  // useEffect(() => {
//   //   async function initializeClient() {
//   //     const client = await create();
//   //     const account = await client.login('ciolocapaul@yahoo.com');
//   //     const space = await client.createSpace('test1_space');

//   //     await account.provision(space.did());
//   //     await space.save();
//   //     console.log('space', space);
//   //     await client.setCurrentSpace(space.did())

//   //     const recovery = await space.createRecovery(account.did())
//   //     await client.capability.access.delegate({
//   //       space: space.did(),
//   //       delegations: [recovery],
//   //     })



  
//   //     const files = [
//   //       new File(['some-file-content'], '001/readme.md'),
//   //       new File(['import foo'], 'src/main.py'),
//   //       new File(['some-file-content.........'], '002/testing2.md')
//   //     ]


//   //     const files2 = [new File(['newFILE'], 'file2.txt')];
      
  
//   //     const directoryCid = await client.uploadDirectory(files);
//   //     console.log('Uploaded directory CID:', directoryCid);
       
//   //     const directoryCidString = directoryCid.toString();
//   //     console.log('Uploaded directory CID:', directoryCidString);

//   //     const cid2 = await client.uploadDirectory(files2);
//   //     console.log('Uploaded directory CID:', cid2.toString());

//   //     // try {
//   //     //   const content = await client.capability.upload.list({ cursor: '', size: 25 });
//   //     //   console.log('Retrieved content:', content);
//   //     // } catch (error) {
//   //     //   console.error('Error retrieving content:', error);
//   //     // }
  
  
//   //   }

//    // initializeClient().catch(console.error);
//   //}, []);



//     return (
//         <MetamaskProvider>
//             <Component {...pageProps} />
//             <div>
//             {entityDetails ? ( // Check if entityDetails is available
//             // If entityDetails is available, render the SignupForm
//             <p>Entity is not registered or not connected.</p>
            
//         ) : (
//             // If entityDetails is not available, render the message
//             <SignupFormDemo />
//         )}
//             </div>
//         </MetamaskProvider>
//     );
// };

// export default MyApp;


    //"use client";
    import "../styles/globals.css";
    import type { AppProps } from "next/app";
    import { MetamaskProvider } from "../hooks/useMetamask";
    import { UserProvider } from "../context/EntityData";
    import LoggedComponent from "../components/LoggedComponent";
    import { TracingBeam } from "../components/tracing-beam";
    import { FileUrlProvider } from "../context/FileUrlContext";

    
    

    const MyApp = ({ Component, pageProps }: AppProps) => {
        //const {entityDetails, setEntityDetails} = useWeb3();
        //const [showLoader, setShowLoader] = useState(false);
        //const [showShipmentManager, setShowShipmentManager] = useState(false);
 
    

        return (
            <UserProvider>
                <MetamaskProvider>

                <FileUrlProvider>
                
                    <Component {...pageProps}  />
                    
                    <TracingBeam className="min-h-screen">
                        <>
                            <LoggedComponent />
                        </>
                    </TracingBeam>
                        
                </FileUrlProvider>

                           
                </MetamaskProvider>
            </UserProvider>
          
        );
    };  


    export default MyApp;



