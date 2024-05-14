import { useEffect, useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useUser } from "../context/EntityData";
import WelcomeComponent from "../components/welcomeComponent";

import { PinContainer } from "../components/3d_pin";
import { EvervaultCard } from "../components/evervault-card";
import { MultiStepLoader } from "../components/multi-step-loader";
import  ShipmentManager  from "../components/ShipmentManager";
import { SignupFormDemo } from "./SignupFormDemo";
import FileUploadForm from "./FileUploadForm";
import ProductManager from "./ProductManager";

const LoggedComponent = () => {
    const { user } = useUser();
    const [showShipmentManager, setShowShipmentManager] = useState(false);
    const [showProductManager, setShowProductManager] = useState(false);
    const [showLoader, setShowLoader] = useState(false);


    const handleBack = () => {
        setShowShipmentManager(false);
        setShowProductManager(false);
    }

    useEffect(() => {
        console.log("Loggggggg: ", user);
    }, [user]);


    const loadingStates = [
        { text: "Track." },
        { text: "Record." },
        { text: "Verify." },
        { text: "Report." }
    ];



    return (
        <>
            {user && user.name !== "" ? (
                <>
                     <WelcomeComponent />
                    {showShipmentManager ? (
                        <ShipmentManager onBack={handleBack} />
                    ) : showProductManager ? (
                        <ProductManager onBack={handleBack} />
                    ) : (
                        <>
                            <EvervaultCard text="Blockchain tracking DApp" />
                            <div className="mt-8 md:mt-12"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl px-4">
                                <div onClick={() => setShowShipmentManager(true)}>
                                <PinContainer title="Create Shipment" href="#">
                                    <div className="flex flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                                            Shipments logger
                                        </h3>
                                        <div className="text-base !m-0 !p-0 font-normal">
                                            <span className="text-slate-500 "></span>
                                        </div>
                                        <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-blue-500 via-gray-500 to-yellow-500" />
                                    </div>
                                </PinContainer>
                            </div>
                            <PinContainer
                                title="Track Shipments"
                                href="https://example.com/track"
                            >
                                <div className="flex flex-col p-4 tracking-tight text-slate-100 w-[20rem] h-[20rem]">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                                        Track Your Goods
                                    </h3>
                                    <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-yellow-500 via-gray-500 to-black-500" />
                                </div>
                            </PinContainer>
                            <div onClick={() => setShowProductManager(true)}>
                            <PinContainer
                                title="Manage Inventory"
                                href="https://example.com/inventory"
                            >
                                <div className="flex flex-col p-4 tracking-tight text-slate-100 w-[20rem] h-[20rem]">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                                        Inventory Overview
                                    </h3>
                                    <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-gray-500 via-gray-500 to-orange-500" />
                                </div>
                            </PinContainer>
                            </div>
                            </div>
                            
                        </>
                    )}
                </>
            ) : (
                <>
                
                    <SignupFormDemo />
                    <FileUploadForm />
                </>
            )}

            <div className="mt-20 md:mt-24"></div>
            <div className="flex justify-center items-center h-full"> {/* Ensures full-height centering */}
                <button 
                    onClick={() => setShowLoader(true)} 
                    className="mt-4 bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    DApp's "long story short"
                </button>
            </div>

            {showLoader && (
                <>
                    <MultiStepLoader loadingStates={loadingStates} loading={showLoader} />
                    <button onClick={() => setShowLoader(false)} className="fixed top-4 right-4 text-black dark:text-white z-[120]">
                        <IconSquareRoundedX className="h-10 w-10" />
                    </button>
                </>
            )}
        </>
    );
};

export default LoggedComponent;
