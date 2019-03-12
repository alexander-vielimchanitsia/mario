import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";

export interface IEnemy {
  physics: Physics;
  solid: Solid;
  pendulumMove: PendulumMove;
  killable: Killable;
}
