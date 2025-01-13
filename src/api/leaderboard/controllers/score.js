'use strict';

/**
 * leaderboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::leaderboard.leaderboard', () => ({
    async score(ctx, next) {


        const findUsers = await strapi
            .query('api::leaderboard.leaderboard')
            .findMany();

        if (findUsers.length === 0) {
            throw new Error('No users found.');
        }


        // Update users in batch
        const updatedUsers = await Promise.all(
            findUsers.map(async user => {
                const userId = user.id;
                const updatedUser = await strapi.entityService.update(
                    'api::leaderboard.leaderboard',
                    userId,
                    {
                        data: {
                            score: "0/0",
                            log: "",
                        },
                    }
                );
                console.log(`User with ID ${userId} updated successfully.`);
                return updatedUser;
            })
        );

        console.log(`${updatedUsers.length} users updated.`);


        ctx.response.status = 200;
        ctx.response.body = { message: `${updatedUsers.length} users updated.` };

    }
}
));