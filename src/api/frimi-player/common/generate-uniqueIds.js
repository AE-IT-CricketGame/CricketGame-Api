/**
 * Generates a unique ID with a specified maximum length (30 or below).
 * @param {number} length - The desired length of the unique ID (maximum 30).
 * @returns {string} - The generated unique ID.
 */
const generateUniqueId = (length) => {
    if (length > 30 || length <= 0) {
        throw new Error('Length must be greater than 0 and 30 or below.');
    }

    // Generate a random ID using Math.random and convert it to a string
    const randomString = Math.random().toString(36).substring(2) + Date.now().toString(36);
    return randomString.substring(0, length);
};

const generateRandomNumber = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateMerchantRefNo = () => {
    const randomDigits = generateRandomNumber(5);
    return `MQ${randomDigits}`;
};

const generateRequestId = () => {
    return generateRandomNumber(5).toString();
};



module.exports = { generateUniqueId,generateMerchantRefNo,generateRequestId };
