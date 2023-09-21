'use strict';

/**
 * leaderboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment.payment', () => ({
    async update(ctx, next) {
        try {
            const mobile = ctx.request.query.mobile;
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


module.exports = createCoreController('api::payment.payment', () => ({
    async cycleDelete(ctx, next) {
        try {
            const findUsers = await strapi
                .query('api::payment.payment')
                .findMany();
        
            if (findUsers.length === 0) {
                throw new Error('No users found.');
            }
        
            // Filter users with cycle === 0
            const usersToUpdate = findUsers.filter(user => user.cycle !== 0);
        
            if (usersToUpdate.length === 0) {
                ctx.response.status = 404;
                ctx.response.body = { message: `No user have 0 in cycle` };
            } else {
                // Update users in batch
                const updatedUsers = await Promise.all(
                    usersToUpdate.map(async user => {
                        const userId = user.id;
                        const updatedUser = await strapi.entityService.update(
                            'api::payment.payment',
                            userId,
                            {
                                data: {
                                    cycle: 0,
                                },
                            }
                        );
                        console.log(`User with ID ${userId} updated successfully.`);
                        return updatedUser;
                    })
                );
        
                console.log(`${updatedUsers.length} users updated.`);

              
                    ctx.response.status = 200; 
                    ctx.response.body =  { message: `${updatedUsers.length} users updated.` };
                  
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        
    }
}));