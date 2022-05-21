module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the new Entity Slice?',
      },
    ];

    return inquirer
      .prompt(questions)
      .then((answers) => {
        const queries = [];

        return inquirer.prompt(queries).then((nextAnswers) => ({ ...answers, ...nextAnswers }));
      });
  },
};
