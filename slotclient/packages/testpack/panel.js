/* eslint-disable no-undef */
Editor.Panel.extend({
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  template: `
    <h2>Panel</h2>
    <ui-button id="btn">What</ui-button>
    <hr />
    <div>State: <span id="label">--</span></div>
  `,

  $: {
    btn: '#btn',
    label: '#label',
  },

  ready() {
    this.$btn.addEventListener('confirm', () => {
      this.$label.innerText = 'Hello World';
      setTimeout(() => {
        this.$label.innerText = '--';
      }, 500);
    });
  },
});
