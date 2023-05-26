'use strict';

/**
 * admin controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::admin.admin', () => ({
    async admin(ctx, next) {
        console.log("@@@@@@@@@@@@@@@@@", ctx.request.body);
      
        await next();
    }
  }));
