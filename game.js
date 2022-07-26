const Game = (function () {
  const canvas = document.getElementById('gamejs');
  const context = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const minDim = Math.min(WIDTH, HEIGHT);
  const maxDim = Math.max(WIDTH, HEIGHT);
  const ratio = minDim / maxDim;
  const minLabel = WIDTH < HEIGHT ? 'WIDTH' : 'HEIGHT';

  let componentId = 0;
  let cameraId = 0;
  let components = [];
  let cameras = [];
  let tickInterval;
  let renderInterval;
  let isRunning = false;
  let activeCamera;

  class Component {
    constructor(options = {}) {
      this.id = componentId++;
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

  class Camera {
    constructor(x, y, z) {
      this.id = cameraId++;
      this.move(x, y, z);
      this.getPixelSize();
      cameras.push(this);
    }

    getBorder({ cache } = {}) {
      if (!this.isMoved) return this.border;
      if (cache) this.isMoved = false;
      const minOffset = this.z;
      const maxOffset = Math.round(minOffset / ratio);

      if (minLabel === 'WIDTH') {
        this.border = [
          this.x - minOffset,
          this.y - maxOffset,
          2 * minOffset,
          2 * maxOffset,
        ];
      } else {
        this.border = [
          this.x - maxOffset,
          this.y - minOffset,
          2 * maxOffset,
          2 * minOffset,
        ];
      }
      return this.border;
    }

    getPixelSize() {
      if (!this.isMoved) return this.pixelSize;
      const [x, y, width, height] = this.getBorder({ cache: true });
      const [xPixels, yPixels] = [width - x, height - y];
      this.pixelSize = [
        Math.round(WIDTH / xPixels),
        Math.round(HEIGHT / yPixels),
      ];

      return this.pixelSize;
    }

    move(x, y, z) {
      this.x = x || this.x;
      this.y = y || this.y;
      this.z = z || this.z;
      this.isMoved = true;
    }

    isVisible(x, y) {
      const [sx, sy, width, height] = this.getBorder();
      if (x < sx || x > sx + width || y < sy || y > sy + height) return false;
      return true;
    }

    render(ctx) {
      for (let component of components) {
        let { x, y, width, height, sprite } = component.logic;
        if (this.isVisible(x, y)) {
          const [pixelWidth, pixelHeight] = this.getPixelSize();
          width = Math.round(width * pixelWidth);
          height = Math.round(height * pixelHeight);

          ctx.drawImage(sprite, x, y, width, height);
        }
      }
    }
  }

  function tick() {
    for (let component of components) {
      component.tick();
    }
  }

  function render() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    if (activeCamera) {
      return activeCamera.render(context);
    }

    for (let component of components) {
      if (component.options.autoRender) {
        const { sprite, x, y } = component.logic;
        context.drawImage(sprite, x, y);
        continue;
      }
      component.render(context);
    }
  }

  function setCamera(cameraId) {
    const foundCamera = cameras.find(camera => camera.id === cameraId);
    if (!foundCamera) throw new Error('Camera id is invalid');
    activeCamera = foundCamera;
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
    Camera,
    setCamera,
  };
})();
