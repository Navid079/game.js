const Game = (function () {
  let id = 0;
  let components = [];
  let tickInterval;
  let renderInterval;
  let isRunning = false;

  class Component {
    constructor() {
      this.id = id++;
      this.logic = this.create();
      this.create = undefined;
      components.push(this);
    }

    tick() {
      throw new Error('Tick function not implemented');
    }

    render() {
      throw new Error('Render function not implemented');
    }

    create() {
      return {};
    }
  }

  function tick() {
    for (let component of components) {
      component.tick();
    }
  }

  function render() {
    for (let component of components) {
      component.render();
    }
  }

  function start() {
    if (isRunning) throw new Error('Game is already running!');
    tickInterval = setInterval(tick, 50);
    renderInterval = setInterval(render, 50);
    isRunning = true;
  }

  function stop() {
    clearInterval(tickInterval);
    clearInterval(renderInterval);
    isRunning = false;
  }

  return {
    Component,
    start,
    stop,
  };
})();
