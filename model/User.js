const mongoose = require('mongoose');

const csvSchema = new mongoose.Schema({
    agent: {
        type: String,
    },
    usersAccount: {
        type: String,
    },
    policyCategory: {
        type: String,
    },
    policyInfo: {
        policyNumber: {
            type: String   
        }, 
        policyStartDate: {
            type: String
        }, 
        policyEndDate: {
            type: String
        }, 
        policyCategory: {
            type: String
        },
        collectionId: {
            type: String   
        }, 
        companyCollectionId: {
            type: String
        }, 
        userId: {
            type: String
        }
    },
    firstName: {
        type: String,
    },
    dob: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    state: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    userType: {
        type: String,
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Csv = mongoose.model('Csv', csvSchema);
module.exports = Csv;
