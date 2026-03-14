import * as cc from "cc";
import {KeyboardInputManager2048, EDirectionMove} from "./KeyboardInputManager2048";
import {Grid2048} from "./components/Grid2048";

const {ccclass, property} = cc._decorator;

@ccclass("GameDirector2048")
export class GameDirector2048 extends cc.Component {
    @property(cc.CCInteger)
    sizeGrid = 4;

    @property(cc.CCInteger)
    startTiles = 2;

    @property(cc.Node)
    grid: cc.Node = null;

    onLoad() {
        const listenerInput = new KeyboardInputManager2048();
        listenerInput.setListenerCallback((direction) => {
            this.move(direction);
        });
        this.setupBoard();
    }

    restart() {
        this.getGridComponent().reset();
        this.addStartTiles();
    }

    move(direction: EDirectionMove) {
        cc.log("[2048-DEBUG] MOVE DIRECTION =>", EDirectionMove[direction]);
    }

    addStartTiles() {
        for (let i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    addRandomTile() {
        if (this.getGridComponent().cellsAvailable()) {
            let value = Math.random() < 0.9 ? 2 : 4;
            let cell = this.getGridComponent().randomAvailableCell();
            this.getGridComponent().insertTile(cell, value);
        }
    }

    private setupBoard() {
        this.getGridComponent().setup(this.sizeGrid);
        this.addStartTiles();
    }

    private gridCompo: Grid2048 = null;
    private getGridComponent() {
        if(!this.gridCompo) {
            this.gridCompo = this.grid.getComponent(Grid2048);
        }
        return this.gridCompo;
    }
}

