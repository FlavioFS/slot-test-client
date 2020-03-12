/* eslint-disable @typescript-eslint/explicit-function-return-type, no-undef */
module.exports = {
  messages: {
    open() {
      Editor.Panel.open('testpack');
      cc.log('trying');
    },
  },
};
