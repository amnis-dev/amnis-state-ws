module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the new core entity?',
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
