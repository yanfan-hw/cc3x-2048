import * as cc from "cc";

export enum EDirectionMove {
    UP,
    RIGHT,
    LEFT,
    DOWN,
}

export class KeyboardInputManager2048 {
    private finishTouch: boolean;
    private touchStartPos: cc.Vec2;

    private listenerCallback: (direction: EDirectionMove) => void;

    constructor() {
        cc.input.off(cc.Input.EventType.KEY_DOWN, this.handleInputKeyDown, this);
        cc.input.off(cc.Input.EventType.TOUCH_START, this.handleInputTouchStart, this);
        cc.input.off(cc.Input.EventType.TOUCH_MOVE, this.handleInputTouchMove, this);
        cc.input.off(cc.Input.EventType.TOUCH_END, this.handleInputTouchEnd, this);

        cc.input.on(cc.Input.EventType.KEY_DOWN, this.handleInputKeyDown, this);
        cc.input.on(cc.Input.EventType.TOUCH_START, this.handleInputTouchStart, this);
        cc.input.on(cc.Input.EventType.TOUCH_MOVE, this.handleInputTouchMove, this);
        cc.input.on(cc.Input.EventType.TOUCH_END, this.handleInputTouchEnd, this);
    }

    public setListenerCallback(cb: (direction: EDirectionMove) => void) {
        this.listenerCallback = cb;
    }

    private handleInputKeyDown(event: cc.EventKeyboard) {
        let direction: EDirectionMove = null;
        switch (event.keyCode) {
            case cc.KeyCode.ARROW_UP:
            case cc.KeyCode.KEY_W:
                direction = EDirectionMove.UP;
                break;
            case cc.KeyCode.ARROW_RIGHT:
            case cc.KeyCode.KEY_D:
                direction = EDirectionMove.RIGHT;
                break;
            case cc.KeyCode.ARROW_LEFT:
            case cc.KeyCode.KEY_A:
                direction = EDirectionMove.LEFT;
                break;
            case cc.KeyCode.ARROW_DOWN:
            case cc.KeyCode.KEY_S:
                direction = EDirectionMove.DOWN;
                break;
        }
        if (direction !== null) {
            this.listenerCallback(direction);
        }
    }

    private handleInputTouchStart(event: cc.EventTouch) {
        if(event.getAllTouches().length > 1) {
            return;
        }
        this.finishTouch = false;
        this.touchStartPos = event.touch.getLocation();
    }

    private handleInputTouchMove(event: cc.EventTouch) {
        if(event.getAllTouches().length > 1 || this.finishTouch || !this.touchStartPos) {
            return;
        }
        const touchMovePos = event.touch.getLocation();
        const dx = touchMovePos.x - this.touchStartPos.x;
        const dy = touchMovePos.y - this.touchStartPos.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) > 10) {
            this.finishTouch = true;
            let direction: EDirectionMove = absDx > absDy ? (dx > 0 ? EDirectionMove.RIGHT : EDirectionMove.LEFT) : (dy > 0 ? EDirectionMove.UP : EDirectionMove.DOWN);
            this.listenerCallback(direction);
        }
    }

    private handleInputTouchEnd(_event: cc.EventTouch) {
        this.finishTouch = false;
        this.touchStartPos = null
    }
}
