'use strict';

/**
 * sms-template service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sms-template.sms-template');
