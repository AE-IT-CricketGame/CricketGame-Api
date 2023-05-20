'use strict';

/**
 * leaderboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::leaderboard.leaderboard', () => ({
    async delete(ctx, next) {
      try {
        const mobile = ctx.params.mobile;
  
        const deleteUser = await strapi
          .query('api::leaderboard.leaderboard')
          .deleteMany({ where: { mobile: mobile } });
  
        if (deleteUser.count === 0) {
          ctx.response.status = 404;
          ctx.response.body = { message: 'User not found or already deleted.' };
        } else {
          ctx.response.status = 200; 
          ctx.response.body = { message: 'User deleted successfully.' };
        }
  
     
  
        await next();
      } catch (error) {
        // Handle the error
        console.error('Error occurred during delete:', error);
        // Respond with an error message
        ctx.response.status = 500; // Set the desired status code
        ctx.response.body = { error: 'An error occurred during delete.' };
      }
    }
  }));