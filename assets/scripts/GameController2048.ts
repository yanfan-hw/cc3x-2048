import {
    _decorator,
    Component,
    EventTouch,
    input,
    Input,
    instantiate,
    KeyCode,
    log,
    Node,
    Prefab,
    sys,
    tween,
    Tween,
    v3,
    Vec3
} from "cc";
import {BoardLogic2048} from "./BoardLogic2048";
import {GameConfig, MoveAction, MoveDir} from "./GameConfig2048";
import {ScoreManager2048} from "./ScoreManager2048";
import {Tile2048} from "./Tile2048";

const {ccclass, property} = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property(Node) tileHolder: Node = null;
    @property(Prefab) tilePrefab: Prefab = null;
    @property(ScoreManager2048) scoreManager: ScoreManager2048 = null;

    private _locTouchStart = null;
    private _isEndSwipe = false;

    private _logic: BoardLogic2048 = new BoardLogic2048();

    private _gridTiles: (Tile2048 | null)[][] = [];
    private _tilePool: Tile2048[] = [];

    private _isAnimating = false;

    onLoad() {
        this._initGrid();
        if (sys.isMobile || sys.isNative) {
            this._registerTouchEvents();
        } else {
            this._registerKeyboardEvents();
        }
    }

    start() {
        this._spawnTileNode(this._logic.addRandomTile());
        this._spawnTileNode(this._logic.addRandomTile());
    }

    restart() {
        this._isAnimating = false;
        this._logic.reset();
        this.scoreManager.reset();
        this._tilePool.forEach(tile => {
            Tween.stopAllByTarget(tile.node);
            tile.node.active = false;
        });
        this._gridTiles.forEach(r => r.fill(null));
        this._spawnTileNode(this._logic.addRandomTile());
        this._spawnTileNode(this._logic.addRandomTile());
    }

    private _initGrid() {
        this._gridTiles = Array.from({length: GameConfig.GRID_SIZE}, () =>
            new Array(GameConfig.GRID_SIZE).fill(null)
        );

        const totalTiles = GameConfig.GRID_SIZE * GameConfig.GRID_SIZE;
        for (let i = 0; i < totalTiles; i++) {
            const node = instantiate(this.tilePrefab);
            this.tileHolder.addChild(node);
            const tileComp = node.getComponent(Tile2048);

            node.active = false;
            this._tilePool.push(tileComp);
        }
    }

    private _getAvailableTile(): Tile2048 | null {
        return this._tilePool.find(t => !t.node.active) || null;
    }

    private async _moveTiles(dir: MoveDir) {
        if (this._isAnimating) {
            return;
        }
        const result = this._logic.move(dir);

        if (result.moved) {
            this._isAnimating = true;

            await this._playMoveAnimations(result.actions);
            this._spawnTileNode(this._logic.addRandomTile());
            this.scoreManager.updateScore(this._logic.score);

            if (this._logic.isGameOver()) {
                log("GAME OVER! Score: " + this._logic.score);
            }

            this._isAnimating = false;
        }
    }

    private _registerKeyboardEvents() {
        input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
    }

    private _registerTouchEvents() {
        this.tileHolder.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.tileHolder.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.tileHolder.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.tileHolder.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.tileHolder.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.tileHolder.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.tileHolder.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.tileHolder.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    private _onKeyDown(event: any) {

        const dirMap: Record<number, MoveDir> = {
            [KeyCode.ARROW_UP]: MoveDir.UP, [KeyCode.KEY_W]: MoveDir.UP,
            [KeyCode.ARROW_DOWN]: MoveDir.DOWN, [KeyCode.KEY_S]: MoveDir.DOWN,
            [KeyCode.ARROW_LEFT]: MoveDir.LEFT, [KeyCode.KEY_A]: MoveDir.LEFT,
            [KeyCode.ARROW_RIGHT]: MoveDir.RIGHT, [KeyCode.KEY_D]: MoveDir.RIGHT,
        };

        const dir = dirMap[event.keyCode];
        if (dir === undefined) {
            return;
        }
        void this._moveTiles(dir);
    }

    private _onTouchStart(event: EventTouch) {
        this._locTouchStart = event.getStartLocation();
        this._isEndSwipe = false;
    }

    private _onTouchMove(event: EventTouch) {
        if (!this._locTouchStart || this._isEndSwipe) {
            return;
        }
        const locMove = event.getLocation();
        const dx = locMove.x - this._locTouchStart.x;
        const absDx = Math.abs(dx);
        const dy = locMove.y - this._locTouchStart.y;
        const absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) > 10) {
            void this._moveTiles(absDx > absDy ? (dx > 0 ? MoveDir.RIGHT : MoveDir.LEFT) : (dy > 0 ? MoveDir.UP : MoveDir.DOWN));
            this._isEndSwipe = true;
        }
    }

    private _onTouchEnd() {
        this._locTouchStart = null;
        this._isEndSwipe = false;
    }

    private _onTouchCancel() {
        this._locTouchStart = null;
        this._isEndSwipe = false;
    }

    private async _playMoveAnimations(actions: MoveAction[]) {
        const animationTasks = actions.map(action => {
            const tile = this._gridTiles[action.from.r][action.from.c];
            const targetPos = this._calculatePos(action.to.r, action.to.c);

            this._gridTiles[action.from.r][action.from.c] = null;
            let targetTile: Tile2048 = null;

            if (!action.isMerge) {
                this._gridTiles[action.to.r][action.to.c] = tile;
            } else {
                targetTile = this._gridTiles[action.to.r][action.to.c];
            }

            return {tile, targetPos, isMerge: action.isMerge, newValue: action.newValue, targetTile};
        });

        const promises = animationTasks.map(task => {
            return new Promise<void>(res => {
                task.tile.node.setSiblingIndex(99);

                tween(task.tile.node)
                    .to(GameConfig.ANIM_DURATION, {position: task.targetPos}, {easing: "sineInOut"})
                    .call(() => {
                        if (task.isMerge) {
                            task.tile.node.active = false;

                            if (task.targetTile) {
                                task.targetTile.updateView(task.newValue, GameConfig.COLORS, GameConfig.COLORS.SUPER);
                                task.targetTile.playMerge();
                            }
                        }
                        res();
                    })
                    .start();
            });
        });

        await Promise.all(promises);
    }

    private _spawnTileNode(data: { r: number, c: number, value: number } | null) {
        if (!data) {
            return;
        }

        const tileComp = this._getAvailableTile();
        if (!tileComp) {
            return;
        }

        tileComp.node.active = true;
        tileComp.updateView(data.value, GameConfig.COLORS, GameConfig.COLORS.SUPER);
        tileComp.node.setPosition(this._calculatePos(data.r, data.c));

        tileComp.playAppear();
        this._gridTiles[data.r][data.c] = tileComp;
    }

    private _calculatePos(r: number, c: number): Vec3 {
        const offset = GameConfig.TILE_SIZE + GameConfig.SPACING;
        const halfGrid = (GameConfig.GRID_SIZE - 1) / 2;
        const x = (c - halfGrid) * offset;
        const y = (halfGrid - r) * offset;
        return v3(x, y, 0);
    }
}