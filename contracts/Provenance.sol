// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Provenance {
    address public admin;
    mapping(address => Entity) public entities;
    mapping(string => Product) public products;
    mapping(string => Shipment) public shipments;
    string[] public productSerialNumbers;
    string[] public shipmentSerialNumbers;
    mapping(address => string[]) private pendingShipmentTransfers;
    address[] private registeredEntityAddresses;

    enum Role {
        Supplier,
        Producer,
        Transporter,
        Warehouse,
        Market
    }
    enum ShipmentStatus {
        Created,
        InTransit,
        Delivered,
        Arrived,
        Rejected,
        Verify
    }

    event EntityRegistered(
        address indexed entityAddress,
        Role role,
        string name,
        bool certified,
        string link
    );
    event ProductAdded(
        string serialNo,
        string name,
        uint timeStamp,
        address indexed producer,
        string[] parentSerialNos,
        string[] shipmentSerialNos
    );
    event OwnershipTransferred(
        string serialNo,
        address indexed previousOwner,
        address indexed newOwner
    );
    event ShipmentAdded(
        string serialNo,
        string productSerialNo,
        uint quantity,
        uint timeStamp,
        address indexed sender
    );
    event ShipmentStatusUpdated(
        string serialNo,
        ShipmentStatus status,
        uint timeStamp
    );
    event TemperatureLogged(string serialNo, int temperature, uint timeStamp);
    event Alert(string serialNo, string message, uint timeStamp);
    event EntityCertified(address indexed entityAddress, bool certified);
    event ProductTransformed(string newSerialNo, string[] parentSerialNos);
    event ShipmentLocationUpdated(
        string serialNo,
        string location,
        uint timeStamp
    );

    struct Entity {
        address entityAddress;
        Role role;
        string name;
        string location;
        bool isRegistered;
        bool isCertified;
        string link; // Link to additional information
    }

    struct Product {
        string name;
        uint timeStamp;
        address currentHolder;
        string[] parentSerialNumbers; // Array of parent product serial numbers
        string[] shipmentSerialNumbers; // Array to store associated shipment serial numbers
    }

    struct Shipment {
        string productSerialNo;
        uint quantity;
        uint timeStamp;
        ShipmentStatus status;
        address currentHolder;
        address[] holders;
        string[] locations;
        int[] temperatures;
    }

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(entities[msg.sender].isRegistered, "Entity is not registered");
        _;
    }

    function isAdmin(address user) public view returns (bool) {
        return user == admin;
    }

    function registerEntity(
        address entity,
        Role role,
        string memory name,
        string memory location,
        bool certified,
        string memory link
    ) public onlyAdmin {
        require(!entities[entity].isRegistered, "Entity already registered");
        entities[entity] = Entity(
            entity,
            role,
            name,
            location,
            true,
            certified,
            link
        );
        registeredEntityAddresses.push(entity); // Add the new entity's address to the array
        emit EntityRegistered(entity, role, name, certified, link);
    }

    function certifyEntity(address entity, bool certified) public onlyAdmin {
        require(
            entities[entity].isRegistered,
            "Entity must be registered first"
        );
        entities[entity].isCertified = certified;
        emit EntityCertified(entity, certified);
    }

    function updateShipmentStatus(
        string memory serialNo,
        ShipmentStatus status
    ) public onlyRegistered {
        require(shipments[serialNo].timeStamp != 0, "Shipment does not exist");
        require(
            shipments[serialNo].currentHolder == msg.sender,
            "Only the current holder can update status"
        );

        shipments[serialNo].status = status;
        emit ShipmentStatusUpdated(serialNo, status, block.timestamp);
    }

    function createAlert(
        string memory serialNo,
        string memory message
    ) public onlyRegistered {
        require(shipments[serialNo].timeStamp != 0, "Shipment does not exist");
        emit Alert(serialNo, message, block.timestamp);
    }

    function getEntityDetails(
        address entity
    ) public view returns (Entity memory) {
        return entities[entity];
    }

    function getProductDetails(
        string memory serialNo
    ) public view returns (Product memory) {
        return products[serialNo];
    }

    function getShipmentDetails(
        string memory serialNo
    ) public view returns (Shipment memory) {
        return shipments[serialNo];
    }

    function addProduct(
        string memory serialNo,
        string memory name,
        string[] memory parentSerialNos,
        string[] memory shipmentSerialNos
    ) public onlyRegistered {
        require(bytes(serialNo).length > 0, "Serial number cannot be empty");
        require(products[serialNo].timeStamp == 0, "Product already exists");

        for (uint i = 0; i < parentSerialNos.length; i++) {
            require(
                products[parentSerialNos[i]].timeStamp != 0,
                "Parent product does not exist"
            );
        }
        for (uint j = 0; j < shipmentSerialNos.length; j++) {
            require(
                shipments[shipmentSerialNos[j]].timeStamp != 0,
                "Shipment does not exist"
            );
        }

        products[serialNo] = Product({
            name: name,
            timeStamp: block.timestamp,
            currentHolder: msg.sender,
            parentSerialNumbers: parentSerialNos,
            shipmentSerialNumbers: shipmentSerialNos
        });

        productSerialNumbers.push(serialNo);
        emit ProductAdded(
            serialNo,
            name,
            block.timestamp,
            msg.sender,
            parentSerialNos,
            shipmentSerialNos
        );
    }

    function getAllProductSerialNumbers()
        public
        view
        returns (string[] memory)
    {
        return productSerialNumbers;
    }

    function addShipment(
        string memory serialNo,
        string memory productSerialNo,
        uint quantity,
        string memory location
    ) public onlyRegistered {
        require(bytes(serialNo).length > 0, "Serial number cannot be empty");
        require(shipments[serialNo].timeStamp == 0, "Shipment already exists");
        require(
            products[productSerialNo].timeStamp != 0,
            "Product does not exist"
        );

        shipments[serialNo] = Shipment(
            productSerialNo,
            quantity,
            block.timestamp,
            ShipmentStatus.Created,
            msg.sender,
            new address[](0), // Correctly initialize as empty
            new string[](0), // Correctly initialize as empty
            new int[](0) // Correctly initialize as empty
        );

        shipments[serialNo].holders.push(msg.sender); // Initialize with the creator's address
        shipments[serialNo].locations.push(location); // Initialize with the first location

        shipmentSerialNumbers.push(serialNo);
        emit ShipmentAdded(
            serialNo,
            productSerialNo,
            quantity,
            block.timestamp,
            msg.sender
        );
    }

    function updateShipmentLocation(
        string memory serialNo,
        string memory location
    ) public {
        require(shipments[serialNo].timeStamp != 0, "Shipment does not exist");
        require(
            shipments[serialNo].currentHolder == msg.sender,
            "Only the current holder can update locations"
        );

        shipments[serialNo].locations.push(location);
        emit ShipmentLocationUpdated(serialNo, location, block.timestamp);
    }

    function associateShipmentToProduct(
        string memory productSerialNo,
        string memory shipmentSerialNo
    ) public onlyRegistered {
        require(
            products[productSerialNo].timeStamp != 0,
            "Product does not exist"
        );
        require(
            shipments[shipmentSerialNo].timeStamp != 0,
            "Shipment does not exist"
        );

        // Optional: Check if the caller is the current holder of the product
        require(
            msg.sender == products[productSerialNo].currentHolder,
            "Only the current holder can associate shipments"
        );

        // Add the shipment serial number to the product's shipment list
        products[productSerialNo].shipmentSerialNumbers.push(shipmentSerialNo);
    }

    function createProductFromExisting(
        string memory serialNo,
        string memory name,
        string[] memory parentSerialNos,
        string[] memory shipmentSerialNos // New parameter for associated shipments
    ) public onlyRegistered {
        require(bytes(serialNo).length > 0, "Serial number cannot be empty");
        require(products[serialNo].timeStamp == 0, "Product already exists");

        for (uint i = 0; i < parentSerialNos.length; i++) {
            require(
                products[parentSerialNos[i]].timeStamp != 0,
                "Parent product does not exist"
            );
        }

        products[serialNo] = Product({
            name: name,
            timeStamp: block.timestamp,
            currentHolder: msg.sender,
            parentSerialNumbers: parentSerialNos,
            shipmentSerialNumbers: shipmentSerialNos // Initialize with passed shipment serial numbers
        });

        productSerialNumbers.push(serialNo);
        emit ProductAdded(
            serialNo,
            name,
            block.timestamp,
            msg.sender,
            parentSerialNos,
            shipmentSerialNos
        );
        emit ProductTransformed(serialNo, parentSerialNos);
    }

    function getProductHistory(
        string memory serialNo
    ) public view returns (string[] memory) {
        return products[serialNo].parentSerialNumbers;
    }

    function logTemperature(
        string memory serialNo,
        int temperature
    ) public onlyRegistered {
        require(shipments[serialNo].timeStamp != 0, "Shipment does not exist");
        require(
            shipments[serialNo].currentHolder == msg.sender,
            "Only the current holder can log temperature"
        );

        shipments[serialNo].temperatures.push(temperature);
        emit TemperatureLogged(serialNo, temperature, block.timestamp);
    }

    function transferShipmentOwnership(
        string memory serialNo,
        address newOwner,
        string memory newLocation
    ) public {
        //require(shipments[serialNo].status == ShipmentStatus.InTransit, "Shipment not owned or already in transfer");
        require(
            shipments[serialNo].currentHolder == msg.sender,
            "Only the current holder can initiate transfer"
        );
        require(
            entities[newOwner].isRegistered,
            "New owner is not a registered entity"
        );

        //shipments[serialNo].status = ShipmentStatus.Verify;
        shipments[serialNo].locations.push(newLocation); // Add the new location
        pendingShipmentTransfers[newOwner].push(serialNo);

        emit OwnershipTransferred(serialNo, msg.sender, newOwner);
    }

    function acceptShipmentOwnership(string memory serialNo) public {
        require(
            isPendingTransfer(serialNo, msg.sender),
            "No pending transfer for this shipment to you"
        );
        address previousOwner = shipments[serialNo].currentHolder;
        shipments[serialNo].currentHolder = msg.sender;
        removePendingTransfer(serialNo, msg.sender);
        emit OwnershipTransferred(serialNo, previousOwner, msg.sender);
    }

    function isPendingTransfer(
        string memory serialNo,
        address user
    ) private view returns (bool) {
        string[] memory userPendingTransfers = pendingShipmentTransfers[user];
        for (uint i = 0; i < userPendingTransfers.length; i++) {
            if (
                keccak256(bytes(userPendingTransfers[i])) ==
                keccak256(bytes(serialNo))
            ) {
                return true;
            }
        }
        return false;
    }

    function removePendingTransfer(
        string memory serialNo,
        address user
    ) private {
        string[] storage userPendingTransfers = pendingShipmentTransfers[user];
        for (uint i = 0; i < userPendingTransfers.length; i++) {
            if (
                keccak256(bytes(userPendingTransfers[i])) ==
                keccak256(bytes(serialNo))
            ) {
                userPendingTransfers[i] = userPendingTransfers[
                    userPendingTransfers.length - 1
                ];
                userPendingTransfers.pop();
                break;
            }
        }
    }

    function getShipmentsByHolder(
        address holder
    ) public view returns (string[] memory) {
        uint totalShipments = shipmentSerialNumbers.length; // Assuming you have an array storing all shipment serial numbers
        uint count = 0;

        for (uint i = 0; i < totalShipments; i++) {
            if (shipments[shipmentSerialNumbers[i]].currentHolder == holder) {
                count++;
            }
        }

        string[] memory holderShipments = new string[](count);
        uint index = 0;

        for (uint i = 0; i < totalShipments; i++) {
            if (shipments[shipmentSerialNumbers[i]].currentHolder == holder) {
                holderShipments[index] = shipmentSerialNumbers[i];
                index++;
            }
        }

        return holderShipments;
    }

    function getAllShipmentSerialNumbers()
        public
        view
        returns (string[] memory)
    {
        return shipmentSerialNumbers;
    }

    function getAllRegisteredEntities() public view returns (address[] memory) {
        return registeredEntityAddresses;
    }
}
