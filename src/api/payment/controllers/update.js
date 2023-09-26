'use strict';

/**
 * leaderboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment.payment', () => ({
    async update(ctx, next) {
        try {
            console.log("data")
            const mobile = ctx.request.query.mobile;
            const log =  ctx.request.query.log;
            const cycle = parseInt(ctx.request.query.cycle, 10);

            // Check if the conversion was successful
            if (!isNaN(cycle)) {
                // Now, 'cycle' contains the integer value
                // console.log(cycle);
            } else {
              
                console.error("Invalid 'cycle' value in the query string");
            }


            const findUser = await strapi
                .query('api::payment.payment')
                .findMany({ where: { mobile: mobile } });

            const userId = findUser[0].id;

            const entry = await strapi.entityService.update('api::payment.payment', userId, {
                data: {
                    cycle: cycle,
                    log:log,
                },
            });



            if (entry.count === 0) {
              ctx.response.status = 404;
              ctx.response.body = { message: 'User not found.' };
            } else {
              ctx.response.status = 200; 
              ctx.response.body = { message: 'User updated successfully.' };
            }



            await next();
        } catch (error) {
            // Handle the error
            console.error('Error occurred during updated:', error);
            // Respond with an error message
            ctx.response.status = 500; // Set the desired status code
            ctx.response.body = { error: 'An error occurred during updated.' };
        }
    }
}));

