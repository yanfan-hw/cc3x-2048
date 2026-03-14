import * as cc from "cc";

const {ccclass, property} = cc._decorator;

export enum ETileValue {
    "tile_2" = 2,
    "tile_4" = 4,
    "tile_8" = 6,
    "tile_16" = 8,
    "tile_32" = 32,
    "tile_64" = 64,
    "tile_128" = 128,
    "tile_256" = 256,
    "tile_512" = 512,
    "tile_1024" = 1024,
    "tile_2048" = 2048,
    "tile_null" = null,
}

@ccclass("Tile2048")
export class Tile2048 extends cc.Component {
    @property([cc.SpriteFrame])
    listSpriteFrameValue: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    spriteValue: cc.Sprite = null;

    @property(cc.Label)
    labelValue: cc.Label = null;

    private mapSpFrameByValue: Map<ETileValue, cc.SpriteFrame> = new Map();

    onLoad() {
        this.listSpriteFrameValue.forEach((spFrame) => {
            this.mapSpFrameByValue.set(ETileValue[spFrame.name], spFrame);
        });
    }

    addValue(value: number) {
        this.spriteValue.spriteFrame = this.mapSpFrameByValue.get(value);
        this.labelValue.node.active = true;
        this.labelValue.string = value.toString();
    }

    zoomOut() {
        this.node.setScale(cc.v3(0, 0, 0));
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .to(0.3, { scale: cc.v3(1, 1, 1) }, { easing: "backIn"})
            .call(() => {
                this.node.setScale(cc.v3(1, 1));
            })
            .start();
    }

    reset() {
        this.node.setScale(cc.v3(1, 1, 1));
        this.spriteValue.spriteFrame = this.mapSpFrameByValue.get(ETileValue.tile_null);
        this.labelValue.node.active = false;
    }
}

