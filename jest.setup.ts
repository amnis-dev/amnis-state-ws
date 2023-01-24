/* eslint-disable @typescript-eslint/no-explicit-any */
global.log = (data: any) => {
  if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  console.log(data);
};
