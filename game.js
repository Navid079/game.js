const Game = (function () {
  let id = 0;
  class Component {
    constructor() {
      this.id = id++;
      this.logic = this.logic();
    }

    tick() {
      throw new Error('Tick function not implemented');
    }

    render() {
      throw new Error('Render function not implemented');
    }

    logic() {
      return {};
    }
  }

  return {
    Component,
  };
})();
