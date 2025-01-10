'use strict';

const axios = require('axios');
const { getToken } = require('./frimi-token'); // Import the token generation utility

const getCustomerDetails = async (uuid, mid, lid) => {
  try {
    // Generate a fresh token
    const token = await getToken();

    // Construct the request URL
    const url = `${process.env.FRIMI_CUSTOMER_DETAILS_URL}?uuid=${uuid}&mid=${mid}&lid=${lid}`;

    // Construct headers
    const headers = {
      Authorization: `Bearer ${token}`, // Bearer token
    //   uuid, // Unique ID for the request
      channel: '2', // Fixed value as per the screenshot
      version: '1', // Fixed value as per the screenshot
      requestType: 'LS', // Fixed value as per the screenshot
      languageCode: 'en', // Fixed value as per the screenshot
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
