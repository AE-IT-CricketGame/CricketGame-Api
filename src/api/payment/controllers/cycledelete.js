'use strict';

/**
 * leaderboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


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
            const usersToUpdate = findUsers.filter(user => user.cycle === 1);
        
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
                                    cycle: 3,
                                    log:"",
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