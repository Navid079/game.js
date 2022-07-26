const Game = (function () {
  const canvas = document.getElementById('gamejs');
  const context = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let id = 0;
  let components = [];
  let tickInterval;
  let renderInterval;
  let isRunning = false;

  class Component {
    constructor(options = {}) {
      this.id = id++;
      this.logic = this.create();
      this.create = undefined;
      this.options = options;
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
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (let component of components) {
      if (component.options.autoRender) {
        const { sprite, x, y } = component.logic;
        context.drawImage(sprite, x, y);
        continue;
      }
      component.render(context);
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
