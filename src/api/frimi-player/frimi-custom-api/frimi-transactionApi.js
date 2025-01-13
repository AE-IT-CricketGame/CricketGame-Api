'use strict';
const { getToken } = require('./frimi-token');
const axios = require('axios');
const { generateUniqueId, generateMerchantRefNo, generateRequestId } = require('../common/generate-uniqueIds');
const { HEADERS, CURRENCY_CODES, RESPONSE_SUCCESS } = require('../common/constants');

const postTransaction = async (walletId) => {
    try {
        const token = await getToken(); 
        const uniqueId = generateUniqueId(30); 

        const url = process.env.FRIMI_CUSTOMER_TRANSACTION_URL;

        // Payload for the API request
        const payload = {
            wallet_id: walletId,
            amount: process.env.FRIMI_CUSTOMER_AMOUNT,
            currency: CURRENCY_CODES.LKR,
            tid: process.env.FRIMI_CUSTOMER_TID,
            mid: process.env.FRIMI_CUSTOMER_MID,
            merchant_ref_no: generateMerchantRefNo(),
            request_id: generateRequestId(),
            discount_amount: '00.00',
            lid: process.env.FRIMI_CUSTOMER_LID,
        };

        // Headers for the API request
        const headers = {
            Authorization: `Bearer ${token}`,
            uuid: uniqueId,
            channel: HEADERS.CHANNEL,
            version: HEADERS.VERSION,
            requestType: HEADERS.REQUEST_TYPE,
            languageCode: HEADERS.LANGUAGE_CODE,
            datetime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        };

        // Make the API request
        const response = await axios.post(url, payload, { headers });

        // Handle the response
        if (response.data.response_description === RESPONSE_SUCCESS) {
            return response.data;
        } else {
            throw new Error(`Transaction failed: ${response.data.response_description}`);
        }
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        console.error('Error in postTransaction:', errorMessage);
        throw new Error(`Post Transaction Error: ${errorMessage}`);
    }
};

module.exports = { postTransaction };
