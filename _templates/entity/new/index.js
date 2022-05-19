module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'select',
        name: 'category',
        message: 'Select data category of slice.',
        choices: ['account', 'content', 'system'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Name of the new slice?',
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
