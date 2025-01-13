'use strict';

/**
 * frimi-player transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dbService = require('../database/frimi-database');
const { postTransaction } = require('../frimi-custom-api/frimi-transactionApi');

module.exports = createCoreController('api::frimi-player.frimi-player', () => ({
  async usertransation(ctx) {
    try {
      // Fetch all wallets where the transaction status is not true
      const getWalletsData = await dbService.getWallets();

      if (getWalletsData.length === 0) {
        return ctx.send({ message: 'No wallets found with pending transactions.' });
      }

      // Process transactions for each wallet
      const processedWallets = [];
      for (const wallets of getWalletsData) {
        try {
          // Example: Running a transaction logic for each wallet ID
          const transactionResult = await postTransaction(wallets.wallet_id);

          // Update wallet transaction status to true after successful transaction
        await dbService.updateWalletsId(wallets.id);

          processedWallets.push({ walletId: wallets.wallet_id, success: true });
        } catch (error) {
          processedWallets.push({ walletId: wallets.wallet_id, success: false, error: error.message });
        }
      }

      // Return response with details of processed wallets
      return ctx.send({
        message: 'Transaction processing completed.',
        processedWallets,
      });
    } catch (e) {
      console.error('Error in usertransation:', e);
      return ctx.badRequest('An error occurred while processing transactions.');
    }
  },
}));
