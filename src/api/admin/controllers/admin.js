'use strict';

/**
 * admin controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::admin.admin', () => ({
    async admin(ctx, next) {
        try {
          const body = ctx.request.body;
          
          const status = body.status;
          const mobile = body.msisdn;
          let editMobile;


          if (mobile.startsWith('94')) {
            editMobile = '0' + mobile.slice(2); // Remove the first two characters and add "0"
          }
      
          if (status === 'UNSUBSCRIBED') {
            console.log("UNSUBSCRIBED");
          
            const deleteUser = await strapi
            .query('api::leaderboard.leaderboard')
            .deleteMany({ where: { mobile: editMobile } });
    
          if (deleteUser.count === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: 'User not found or already deleted.' };
          } else {
            ctx.response.status = 200; 
            ctx.response.body = { message: 'User deleted successfully.' };
          }
    
          }
      
          if (status === 'SUBSCRIBED') {
            console.log('SUBSCRIBED');
      
            const subscribedObj = {};
            subscribedObj.data = body;
      
            console.log(subscribedObj);
      
            try {
              const AddLog = await strapi.query('api::admin.admin').create({ data: subscribedObj });
              ctx.response.status = 200; 
              ctx.response.body = { message: 'Data Add Successfully.' };
            } catch (error) {
                ctx.response.status = 404; // Set the desired status code
                ctx.response.body = { error: 'An error occurred during Adding.' };
            }
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
