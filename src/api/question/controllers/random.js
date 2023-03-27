'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::question.question', () => ({
  async getOne(ctx, next) {
    const questions = await strapi.query('api::question.question').findMany({ published_at_ne: null });
    const randomIndex = Math.floor(Math.random() * questions.length);
const randomItem = questions[randomIndex]
    ctx.body = randomItem;
  },
}));