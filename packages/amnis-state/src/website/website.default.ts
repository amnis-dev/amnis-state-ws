import { websiteCreate } from '@amnis/core/website';

export const [websiteDefault] = websiteCreate({
  name: 'Unnamed Website',
  url: 'http://localhost',
});

export default websiteDefault;
