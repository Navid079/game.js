(function () {
  class Comp extends Game.Component {
    tick() {
      console.log(this.logic.a);
    }
    render() {
      console.log('render');
    }
    create() {
      return {
        a: 'b',
      };
    }
  }
  const c = new Comp();
  Game.start()
  setTimeout(Game.stop, 1000)
})();
