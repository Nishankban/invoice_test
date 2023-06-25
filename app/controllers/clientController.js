const Client = require('../models/ClientModels/client');

// Create or Update Client
const createOrUpdateClient = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have the authenticated user's ID available in req.user.id
        console.log(userId);
        const { clientId } = req.params.clientId;

        const {
            clientPhoto,
            company,
            shippingAddress,
            billingAddress
        } = req.body;

        let client = await Client.findById(clientId);

        if (client) {
            client.clientPhoto = clientPhoto;
            client.userId = userId;
            client.company = {
                name: company.name,
                personName: company.personName,
                mobileNumber: company.mobileNumber,
                alternativeMobileNumber: company.alternativeMobileNumber || '',
                gstNumber: company.gstNumber,
                email: company.email,
                website: company.website || '',
            };
            client.shippingAddress = {
                addressLine: shippingAddress.addressLine,
                city: shippingAddress.city,
                state: shippingAddress.state,
                country: shippingAddress.country,
                postalCode: shippingAddress.postalCode,
            };
            client.billingAddress = {
                addressLine: billingAddress.addressLine,
                city: billingAddress.city,
                state: billingAddress.state,
                country: billingAddress.country,
                postalCode: billingAddress.postalCode,
            };

            await client.save();
            res.status(200).json({message: 'Client updated successfully.'});
        } else {
            client = new Client({
                userId,
                clientPhoto,
                company: {
                    name: company.name,
                    personName: company.personName,
                    mobileNumber: company.mobileNumber,
                    alternativeMobileNumber: company.alternativeMobileNumber || '',
                    gstNumber: company.gstNumber,
                    email: company.email,
                    website: company.website || '',
                },
                shippingAddress: {
                    addressLine: shippingAddress.addressLine,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    country: shippingAddress.country,
                    postalCode: shippingAddress.postalCode,
                },
                billingAddress: {
                    addressLine: billingAddress.addressLine,
                    city: billingAddress.city,
                    state: billingAddress.state,
                    country: billingAddress.country,
                    postalCode: billingAddress.postalCode,
                },
            });

            await client.save();
            res.status(200).json({message: 'Client created successfully.'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Failed to create/update client.', error});
    }
};


const uploadClientProfile = async (req, res) => {

    try {
        if (!req.file) {
            // No file was uploaded
            return res.status(400).json({success: false, message: 'No file was uploaded.'});
        }
        // File uploaded successfully
        res.json({success: true, message: 'File uploaded successfully.', file: req.file});

    } catch (error) {
        res.status(500).json({message: 'Failed to upload user profile.', error});
    }
};


// Get all Clients for a User
const getClientsByUser = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have the authenticated user's ID available in req.user.id

        const clients = await Client.find({userId});
        res.status(200).json({clients});
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch clients.', error});
    }
};

// Delete a Client
const deleteClient = async (req, res) => {
    try {
        const {clientId} = req.params;

        const client = await Client.findByIdAndDelete(clientId);
        if (!client) {
            return res.status(404).json({message: 'Client not found.'});
        }

        res.status(200).json({message: 'Client deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete client.', error});
    }
};
const getClientById = async (req, res) => {
    try {
        const { clientId } = req.params;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found.' });
        }

        res.status(200).json({ client });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch client.', error });
    }
};

module.exports = {
    createOrUpdateClient,
    getClientsByUser,
    uploadClientProfile,
    getClientById,
    deleteClient
};
