const { ccclass } = cc._decorator;

enum Direction {
  Up,
  Down,
}

@ccclass
export default class SlotEnum extends cc.Component {
  static Direction = Direction;
}
