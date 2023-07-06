const UserProfile = require('../models/UserModels/userprofile');
const fs = require('fs');
const pdf = require('pdf-parse');


// Create or Update User Profile
const createOrUpdateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId); // Assuming you have the authenticated user's ID available in req.user.id

        const {
            userPhoto,
            company,
            address,
            bankInfo
        } = req.body;

        let userProfile = await UserProfile.findOne({ userId });

        if (userProfile) {
            userProfile.userPhoto = userPhoto;
            // Update existing user profile
            userProfile.company = {
                name: company.name,
                owner: company.owner,
                mobileNumber: company.mobileNumber,
                alternativeMobileNumber: company.alternativeMobileNumber || '',
                gstNumber: company.gstNumber,
                email: company.email,
                website: company.website || '',
            };
            userProfile.address = {
                addressLine: address.addressLine,
                city: address.city,
                state: address.state,
                country: address.country,
                postalCode: address.postalCode,
            };
            userProfile.bank = {
                bankName: bankInfo.bankName,
                accountNumber: bankInfo.accountNumber,
                ifscCode: bankInfo.ifscCode,
            };

            await userProfile.save();
            res.status(200).json({ message: 'User profile updated successfully.' });
        } else {
            // Create new user profile
            userProfile = new UserProfile({
                userId,
                userPhoto,
                company: {
                    name: company.name,
                    owner: company.owner,
                    mobileNumber: company.mobileNumber,
                    alternativeMobileNumber: company.alternativeMobileNumber || '',
                    gstNumber: company.gstNumber,
                    email: company.email,
                    website: company.website || '',
                },
                address: {
                    addressLine: address.addressLine,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    postalCode: address.postalCode,
                },
                bank: {
                    bankName: bankInfo.bankName,
                    accountNumber: bankInfo.accountNumber,
                    ifscCode: bankInfo.ifscCode,
                },
            });

            await userProfile.save();

            res.status(200).json({ message: 'User profile created successfully.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create/update user profile.', error });
    }
};


// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have the authenticated user's ID available in req.user.id

        const userProfile = await UserProfile.findOne({userId});
        if (!userProfile) {
            res.status(404).json({message: 'User profile not found.'});
        } else {
            res.status(200).json({userProfile});
        }
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch user profile.', error});
    }
};
const uploadUserProfile = async (req, res) => {

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


    /*      const filePath = req.file.path;

          const pdfBuffer = fs.readFileSync(filePath);

          const options = {};

          let fileContent = '';

          console.log("datareaded");




          pdf(pdfBuffer).then(function(data) {
              res.json({data:data.text});
              console.log(data.text);

          });


  */
};


// Delete User Profile
const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have the authenticated user's ID available in req.user.id

        await UserProfile.deleteOne({userId});
        res.status(200).json({message: 'User profile deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete user profile.', error});
    }
};

module.exports = {
    createOrUpdateUserProfile,
    getUserProfile,
    deleteUserProfile,
    uploadUserProfile
};
