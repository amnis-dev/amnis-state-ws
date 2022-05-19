module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'select',
        name: 'category',
        message: 'Select data category of slice set.',
        choices: ['account', 'component', 'content'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Name of the new slice set?',
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
