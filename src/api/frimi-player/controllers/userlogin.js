'use strict';

/**
 * Frimi controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { getCustomerDetails } = require('../frimi-custom-api/frimi-getCustomerDetails');

module.exports = createCoreController('api::frimi-player.frimi-player', () => ({
    async userlogin(ctx) {

        const { uuid } = ctx.request.body;
        const mid = "2410280192387";
        const lid =  "L030";

        if (!uuid || !mid || !lid) {
            return ctx.badRequest('Missing required parameters: uuid, mid, or lid');
        }

        try {
            const customerDetails = await getCustomerDetails(uuid, mid, lid);

            if (customerDetails.data.mobile === null) {
                return ctx.badRequest('No customer details found');
            }

            const name = customerDetails.data.firstname;
            const mobile = customerDetails.data.mobile;
            const nic = customerDetails.data.nic;
            const walletid = customerDetails.data.wallet_id;

            console.log("Customer",customerDetails)

            const existingUser = await strapi.entityService.findMany('api::frimi-player.frimi-player', {
                filters: { wallet_id: walletid },
                limit: 1,
            });


            if (existingUser.length > 0) {
                return ctx.send({
                    message: 'Customer already exists',
                    data: existingUser[0],
                    tag: 'FRIMI',
                });
            }

            const addFrimiUser = await strapi.entityService.create('api::frimi-player.frimi-player', {
                data: {
                    username: name,
                    mobile: mobile,
                    wallet_id: walletid,
                    nic: nic,
                    uuid: uuid,
                    mid: mid,
                    lid: lid,
                },
            });

            return ctx.send({
                message: 'Customer details added successfully',
                data: addFrimiUser,
                tag: 'FRIMI',

            });
        } catch (error) {
            console.error('Error:', error.message);
            ctx.throw(500, 'An error occurred during the process');
        }
    },
}));
