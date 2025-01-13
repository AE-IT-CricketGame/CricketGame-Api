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

module.exports = { findUserByWalletId, addFrimiUser };
