/**
 * frimi-player controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dbService = require('../database/frimi-database');

module.exports = createCoreController('api::frimi-player.frimi-player', () => ({
  async unsubscribe(ctx) {
    try {
      const { mobile } = ctx.params;

      if (!mobile) {
        return ctx.badRequest('Missing required parameter: mobile');
      }

      // Check if player exists
      const existingUser = await dbService.checkUnsubscrbePlayer(mobile);

      if (!existingUser) {
        return ctx.send({
          message: 'No existing player found. Nothing to unsubscribe.',
        });
      }

      const playerId = existingUser.id;

      // Unsubscribe player
      const deletePlayer = await dbService.unsubuscribePlayer(playerId);

      return ctx.send({
        message: 'Player deleted successfully',
        deletedPlayer: deletePlayer,
      });

    } catch (e) {
      console.error('Error in unsubscribe:', e);
      return ctx.internalServerError('An error occurred while unsubscribing the player.');
    }
  },
}));
