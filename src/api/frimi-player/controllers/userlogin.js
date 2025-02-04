'use strict';

/**
 * Frimi controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { getCustomerDetails } = require('../frimi-custom-api/frimi-getCustomerDetails');
const { postTransaction } = require('../frimi-custom-api/frimi-transactionApi');
const dbService = require('../database/frimi-database');

module.exports = createCoreController('api::frimi-player.frimi-player', () => ({
    async userlogin(ctx) {
        const { uuid } = ctx.request.body;
        const mid = `${process.env.FRIMI_CUSTOMER_MID}`;
        const lid = `${process.env.FRIMI_CUSTOMER_LID}`;

        if (!uuid || !mid || !lid) {
            return ctx.badRequest('Missing required parameters: uuid, mid, or lid');
        }

        try {
            // Fetch customer details
            const customerDetails = await getCustomerDetails(uuid, mid, lid);

            if (!customerDetails.data || customerDetails.data.mobile === null) {
                return ctx.badRequest('No customer details found or invalid response received.');
            }

            const { firstname: name, mobile, nic, wallet_id: walletId } = customerDetails.data;

            // Check if the user already exists
            const existingUser = await dbService.findUserByWalletId(walletId);

            if (existingUser) {
                return ctx.send({
                    message: 'Customer already exists',
                    data: existingUser,
                    tag: 'FRIMI',
                });
            }

            // Run transaction only for new users
            let customerTransaction;
            try {
                customerTransaction = await postTransaction(walletId);
                console.log('Transaction Success:', customerTransaction);
            } catch (transactionError) {
                console.error('Transaction Error:', transactionError.message);
                return ctx.throw(500, 'Transaction failed. Something went wrong during the process.');
            }

            // Save the new user after a successful transaction
            const addFrimiUser = await dbService.addFrimiUser({
                username: name,
                mobile: mobile,
                wallet_id: walletId,
                nic: nic,
                uuid: uuid,
                payment:true,
            });

            return ctx.send({
                message: 'Customer details added successfully',
                data: addFrimiUser,
                tag: 'FRIMI',
            });
        } catch (error) {
            console.error('Error during user login:', error.message);
            ctx.throw(500, `An error occurred: ${error.message}`);
        }
    },
}));
