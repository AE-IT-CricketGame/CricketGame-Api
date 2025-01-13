'use strict';

const axios = require('axios');
const { getToken } = require('./frimi-token');
const { HEADERS } = require('../common/constants');
const { generateUniqueId } = require('../common/generate-uniqueIds');

const getCustomerDetails = async (uuid, mid, lid) => {
  try {
    // Generate a fresh token
    const token = await getToken();

    const uniqueId = generateUniqueId(30); 

    // Construct the request URL
    const url = `${process.env.FRIMI_CUSTOMER_DETAILS_URL}?uuid=${uuid}&mid=${mid}&lid=${lid}`;
    

    // Construct headers
    const headers = {
      Authorization: `Bearer ${token}`,
      uuid: uniqueId,
      channel: HEADERS.CHANNEL,
      version: HEADERS.VERSION,
      requestType: HEADERS.REQUEST_TYPE,
      languageCode: HEADERS.LANGUAGE_CODE,
      datetime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), // Dynamic, formatted as "YYYY-MM-DD HH:mm:ss"
    };

    // Make the GET request
    const response = await axios.get(url, { headers });

    return response.data; // Return the API response
  } catch (error) {
    console.error('Error fetching customer details:', error.response?.data || error.message);
    throw new Error('Failed to fetch customer details');
  }
};

module.exports = { getCustomerDetails };
