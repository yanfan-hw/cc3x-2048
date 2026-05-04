import {Color} from "cc";

export const GameConfig = {
    GRID_SIZE: 4,
    TILE_SIZE: 108,
    SPACING: 15,
    ANIM_DURATION: 0.1,

    COLORS: {
        2: new Color("#eee4da"), 4: new Color("#ede0c8"), 8: new Color("#f2b179"),
        16: new Color("#f59563"), 32: new Color("#f67c5f"), 64: new Color("#f65e3b"),
        128: new Color("#edcf72"), 256: new Color("#edcc61"), 512: new Color("#edc850"),
        1024: new Color("#edc53f"), 2048: new Color("#edc22e"),
        SUPER: new Color("#3c3a32")
    }
};

export enum MoveDir { UP, DOWN, LEFT, RIGHT }

export interface MoveAction {
    from: { r: number, c: number };
    to: { r: number, c: number };
    isMerge: boolean;
    newValue: number;
}