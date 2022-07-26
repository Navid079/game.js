(function () {
  class Comp extends Game.Component {
    tick() {
      console.log(this.logic.a);
    }
    render() {
      console.log('render');
    }
    logic() {
      return {
        a: 'b',
      };
    }
  }
  const c = new Comp();
  c.tick();
})();
