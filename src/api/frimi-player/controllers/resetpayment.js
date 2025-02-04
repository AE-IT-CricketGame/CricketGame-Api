/**
 * frimi-player controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dbService = require('../database/frimi-database');

module.exports = createCoreController('api::frimi-player.frimi-player', () => ({
  async resetpayment(ctx) {
    try {
      // Step 1: Get all player IDs
      const players = await dbService.getAllPlayerIds();

      if (!players || players.length === 0) {
        return ctx.send({ message: 'No players found.' });
      }

      // Step 2: Reset payment status one by one
      for (const player of players) {
        await dbService.resetPaymentStatus(player.id);
      }

      return ctx.send({ message: 'Payment status reset successfully for all players.' });

    } catch (e) {
      console.error('Error in resetpayment:', e);
      return ctx.internalServerError('An error occurred while resetting the payment.');
    }
  },
}));
