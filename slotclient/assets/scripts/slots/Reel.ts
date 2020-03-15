import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel extends cc.Component {
  @property({ type: cc.Node })
  public reelAnchor = null;

  @property({ type: cc.Enum(Aux.Direction) })
  public spinDirection = Aux.Direction.Down;

  @property({ type: [cc.Node], visible: false })
  private tiles = [];

  @property({ type: cc.Prefab })
  public _tilePrefab = null;

  @property({ type: cc.Prefab })
  get tilePrefab(): cc.Prefab {
    return this._tilePrefab;
  }

  set tilePrefab(newPrefab: cc.Prefab) {
    this._tilePrefab = newPrefab;
    this.reelAnchor.removeAllChildren();
    this.tiles = [];

    if (newPrefab !== null) {
      this.createReel();
      this.shuffle();
    }
  }

  private result: Array<number> = [];

  public stopSpinning = false;

  createReel(): void {
    let newTile: cc.Node;
    for (let i = 0; i < 5; i += 1) {
      newTile = cc.instantiate(this.tilePrefab);
      this.reelAnchor.addChild(newTile);
      this.tiles[i] = newTile;
    }
  }

  shuffle(): void {
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i].getComponent('Tile').setRandom();
    }
  }

  readyStop(newResult: Array<number>): void {
    const check = this.spinDirection === Aux.Direction.Down || newResult == null;
    this.result = check ? newResult : newResult.reverse();
    this.stopSpinning = true;
  }

  changeCallback(element: cc.Node = null): void {
    const el = element;
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;
    if (el.position.y * dirModifier > 288) {
      el.position = cc.v2(0, -288 * dirModifier);

      let pop = null;
      if (this.result != null && this.result.length > 0) {
        pop = this.result.pop();
      }

      if (pop != null && pop >= 0) {
        el.getComponent('Tile').setTile(pop);
      } else {
        el.getComponent('Tile').setRandom();
      }
    }
  }

  checkEndCallback(element: cc.Node = null): void {
    const el = element;
    if (this.stopSpinning) {
      this.getComponent(cc.AudioSource).play();
      this.doStop(el);
    } else {
      this.doSpinning(el);
    }
  }

  doSpin(windUp: number): void {
    this.stopSpinning = false;

    this.reelAnchor.children.forEach(element => {
      const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

      const delay = cc.tween(element).delay(windUp);
      const start = cc.tween(element).by(0.25, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'backIn' });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 5));

      delay
        .then(start)
        .then(doChange)
        .then(callSpinning)
        .start();
    });
  }

  doSpinning(element: cc.Node = null, times = 1): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween().by(0.04, { position: cc.v2(0, 144 * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const repeat = cc.tween(element).repeat(times, move.then(doChange));
    const checkEnd = cc.tween().call(() => this.checkEndCallback(element));

    repeat.then(checkEnd).start();
  }

  doStop(element: cc.Node = null): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween(element).by(0.04, { position: cc.v2(0, 144 * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const end = cc.tween().by(0.2, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'bounceOut' });

    move
      .then(doChange)
      .then(move)
      .then(doChange)
      .then(end)
      .then(doChange)
      .start();
  }
}
