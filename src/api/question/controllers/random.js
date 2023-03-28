'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::question.question', () => ({
  async getOne(ctx, next) {
    try {
      let runs = parseInt(ctx.params.runs);

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
          
          break;
      }
  
      const questions = await strapi.query('api::question.question').findMany({ 
        runs: run,
      });
  
      const filteredQuestions = questions.filter(question => question.runs === run);
      
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      const randomItem = filteredQuestions[randomIndex];
  

      ctx.body = randomItem;
    } catch (error) {
      console.error(error);
      ctx.throw(500, 'Internal server error');
    }
  },
}));