'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment.payment', () => ({
    async cycleChange(ctx, next) {
        try {
            const cycle = parseInt(ctx.params.cycle, 10);

            const findUsers = await strapi.query('api::payment.payment').findMany();
            const usersToUpdate = findUsers.filter(user => user.cycle == cycle && user.service_provider === 'dialog');

            if (usersToUpdate.length === 0) {
                ctx.response.status = 404;
                ctx.response.body = { message: `No user have ${cycle} in cycle` };
            } else {
                const updatedCycle = cycle + 1;

                const updatedUsers = await Promise.all(
                    usersToUpdate.map(async user => {
                        const userId = user.id;
                        const updatedUser = await strapi.entityService.update(
                            'api::payment.payment',
                            userId,
                            {
                                data: {
                                    cycle: updatedCycle,
                                },
                            }
                        );
                        console.log(`User with ID ${userId} updated to the cycle ${updatedCycle} successfully.`);
                        return updatedUser;
                    })
                );

                const updatedUsersCount = updatedUsers.length;

                ctx.response.status = 200;
                ctx.response.body = { message: `${updatedUsersCount} updated to the cycle ${updatedCycle} successfully.`};
            }

        } catch (error) {
            console.error('Error in cycleChange:', error);
            ctx.response.status = 500;
            ctx.response.body = { message: 'Internal Server Error' };
        }
    }
}));
