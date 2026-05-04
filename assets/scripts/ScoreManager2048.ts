import {_decorator, Component, Label, Tween, tween, UIOpacity, v3} from "cc";

const {ccclass, property} = _decorator;

@ccclass("ScoreManager2048")
export class ScoreManager2048 extends Component {

    @property(Label)
    labelScore: Label = null;

    @property(Label)
    labelScoreAddition: Label = null;

    @property(Label)
    labelBest: Label = null;

    private currentScore = 0;

    onLoad() {
        this.labelScore.string = "0";
    }

    updateScore(score: number) {
        const diff = score - this.currentScore;
        this.currentScore = score;
        this.labelScore.string = `${score}`;
        if (diff > 0) {
            this.labelScoreAddition.string = `+${diff}`;
            this._playScoreAddition();
        }
    }

    reset() {
        this.labelScore.string = "0";
        this.currentScore = 0;
    }

    _playScoreAddition() {
        this.labelScoreAddition.node.active = true;
        const cmpOpa = this.labelScoreAddition.node.getComponent(UIOpacity);
        Tween.stopAllByTarget(this.labelScoreAddition.node);
        Tween.stopAllByTarget(cmpOpa);
        cmpOpa.opacity = 255;
        const dur = 0.6;
        this.labelScoreAddition.node.setPosition(v3(0, 0, 0));
        tween(cmpOpa)
            .to(dur, {opacity: 0})
            .start();
        tween(this.labelScoreAddition.node)
            .to(dur, {position: v3(0, 100, 0)}, {easing: "sineIn"})
            .start();
    }
}

