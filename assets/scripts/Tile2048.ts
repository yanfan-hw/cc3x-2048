import {_decorator, Component, Label, Sprite, Color, v3, tween} from "cc";

const {ccclass, property} = _decorator;

@ccclass("Tile2048")
export class Tile2048 extends Component {

    @property(Sprite)
    background: Sprite = null;

    @property(Label)
    label: Label = null;

    updateView(value: number, colorMap: Record<number, Color>, superColor: Color) {
        if (value === 0) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.label.string = value.toString();
        this.label.color = value <= 4 ? new Color("#776e65") : new Color("#f9f6f2");
        this.background.color = colorMap[value] || superColor;
    }

    playAppear() {
        this.node.setScale(v3(0, 0, 0));
        tween(this.node)
            .to(0.2, {scale: v3(1, 1, 1)}, {easing: "backOut"})
            .start();
    }

    playMerge() {
        this.node.setScale(v3(0.8, 0.8, 0.8));
        tween(this.node)
            .to(0.05, {scale: v3(1.15, 1.15, 1.15)})
            .to(0.05, {scale: v3(1, 1, 1)})
            .start();
    }
}