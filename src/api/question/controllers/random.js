'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::question.question', () => ({
  async getOne(ctx, next) {
    try {
      const ids = ctx.query.ids;
      const runs = parseInt(ctx.params.runs);

      const arrayIds = ids ? ids.split(",").map(id => parseInt(id)) : [];

      let run;
      switch (runs) {
        case 1:
          run = 'Run_1';
          break;
        case 2:
          run = 'Run_2';
          break;
        case 4:
          run = 'Run_4';
          break;
        case 6:
          run = 'Run_6';
          break;
        default:
          throw new Error(`Invalid value for 'runs': ${runs}`);
      }

      const questions = await strapi.query('api::question.question').findMany({ 
        runs: run,
      });

      const filteredData = questions.filter((data) => !arrayIds.includes(data.id));

      const filteredQuestions = filteredData.filter(question => question.runs === run);

      if (filteredQuestions.length === 0) {
        throw new Error(`No questions found for 'runs': ${runs}`);
      }

      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      const randomItem = filteredQuestions[randomIndex];

      ctx.body = randomItem;
    } catch (error) {
      console.error(error);
      ctx.throw(500, 'Internal server error');
    }
  },
}));