'use strict';

/**
 * Module for Frimi database operations
 */

const findUserByWalletId = async (walletId) => {
    const existingUser = await strapi.entityService.findMany('api::frimi-player.frimi-player', {
        filters: { wallet_id: walletId },
        limit: 1,
    });
    return existingUser.length > 0 ? existingUser[0] : null;
};

const addFrimiUser = async (userData) => {
    return await strapi.entityService.create('api::frimi-player.frimi-player', {
        data: userData,
    });
};

const getWallets = async () => {
    return await strapi.entityService.findMany('api::frimi-player.frimi-player', {
        filters: { payment: false },
        fields: ['id', 'wallet_id'],
      });
};

const updateWalletsId = async (id) => {
    return await strapi.entityService.update('api::frimi-player.frimi-player',id, {
        data: { payment: true },
      });
};

const checkUnsubscrbePlayer = async (mobile) => {
    const existingUser = await strapi.entityService.findMany('api::frimi-player.frimi-player', {
        filters: { mobile: mobile },
        limit: 1,
    });
    return existingUser.length > 0 ? existingUser[0] : null;
};


const unsubuscribePlayer = async (id) => {
    return await strapi.entityService.delete('api::frimi-player.frimi-player',id);
};



module.exports = { findUserByWalletId, addFrimiUser,getWallets,updateWalletsId,checkUnsubscrbePlayer,unsubuscribePlayer };
