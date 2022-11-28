const sendTemplates = {
/**
 * Template for sending a one-time passcode.
 *
 * Examples
 * ```
 * onetimePasscode('123456', '10 minutes');
 * ```
 */
  onetimePasscode: (code: string, lifetime: string) => `\
Your one-time passcode is ${code}.
 
This code will expire in ${lifetime}.\
`,
};

/**
 * Gets send templates.
 */
export const sendGetTemplate = (key: keyof typeof sendTemplates) => sendTemplates[key];

export default sendGetTemplate;

/**
 * Sets a new template or overrites one.
 */
// export const setSendTemplate = (key: string, template: SendTemplate) => {
//   sendTemplates[key] = template;
// };
