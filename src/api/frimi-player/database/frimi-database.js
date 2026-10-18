'use strict';

/**
 * Module for Frimi database operations
 */

const findUserByWalletId = async (walletId) => {
    const existingUser = await strapi.documents('api::frimi-player.frimi-player').findMany({
        filters: { wallet_id: walletId },
        limit: 1,
    });
    return existingUser.length > 0 ? existingUser[0] : null;
};

const addFrimiUser = async (userData) => {
    return await strapi.documents('api::frimi-player.frimi-player').create({
        data: userData,
    });
};

const getWallets = async () => {
    return await strapi.documents('api::frimi-player.frimi-player').findMany({
        filters: { payment: false },
        fields: ['wallet_id'],
      });
};

const updateWalletsId = async (documentId) => {
    return await strapi.documents('api::frimi-player.frimi-player').update({
        documentId,
        data: { payment: true }
    });
};

const checkUnsubscrbePlayer = async (mobile) => {
    const existingUser = await strapi.documents('api::frimi-player.frimi-player').findMany({
        filters: { mobile: mobile },
        limit: 1,
    });
    return existingUser.length > 0 ? existingUser[0] : null;
};


const unsubuscribePlayer = async (documentId) => {
    return await strapi.documents('api::frimi-player.frimi-player').delete({
        documentId
    });
};

const getAllPlayerIds = async () => {
    return await strapi.documents('api::frimi-player.frimi-player').findMany({
        fields: [],
    });
};

const resetPaymentStatus = async (documentId) => {
    return await strapi.documents('api::frimi-player.frimi-player').update({
        documentId,
        data: { payment: false }
    });
};



module.exports = { findUserByWalletId, addFrimiUser,getWallets,updateWalletsId,checkUnsubscrbePlayer,unsubuscribePlayer,getAllPlayerIds,resetPaymentStatus };
