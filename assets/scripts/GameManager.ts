import Tile from "./slots/Tile";
import { Dice } from "./Dice";
import { SlotRoller } from "./slots/SlotRoller"

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

  @property(cc.Node)
  machine: cc.Node = null;

  @property({ type: cc.AudioClip })
  audioClick: cc.AudioClip = null;

  private block = false;
  private result = null;
  
  private _reelCount: number = 0;
  get reelCount(): number {
    if (this._reelCount <= 0) {
      try {
        this._reelCount = this.machine.getComponent('Machine').numberOfReels;
      } catch (error) {
        this._reelCount = 0;
      }
    }
    
    return this._reelCount;
  }
  
  private _tileCount: number = 0;
  get tileCount(): number {
    if (this._tileCount <= 0) {
      try {
        this._tileCount = this.machine.getChildByName('Reel').getChildByName('In').getChildByName('Tile').getComponent('Tile').tileCount;
      } catch (error) {
        this._tileCount = 0;
      }
    }
    
    return this._tileCount;
  }
  
  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        const result: IResult = SlotRoller.roll(this.tileCount, this.reelCount);
        resolve(result.reels);
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
