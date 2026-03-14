import * as cc from "cc";
import {Tile2048} from "./Tile2048";

const {ccclass, property} = cc._decorator;

@ccclass("Grid2048")
export class Grid2048 extends cc.Component {
    @property(cc.Prefab)
    tilePrefab: cc.Prefab = null;

    private size: number;
    private listTileCompo: Tile2048[][] = [];
    private cells: Tile2048 | null [][];

    public setup(size: number) {
        this.node.removeAllChildren();
        this.size = size;
        const gridWidth = 496, tileWidth = 110;
        const padding = 10, spacing = 12;
        const startX = -gridWidth / 2 + tileWidth / 2;
        const startY = -gridWidth / 2 + tileWidth / 2;
        for (let rol = 0; rol < size; rol++) {
            this.listTileCompo.push([]);
            for (let col = 0; col < size; col++) {
                const tile = cc.instantiate(this.tilePrefab);
                let posX = startX + col * (tileWidth + spacing) + padding;
                let posY = startY + rol * (tileWidth + spacing) + padding;

                tile.setPosition(posX, posY, 0);
                this.node.addChild(tile);
                let tileCompo = tile.getComponent(Tile2048);
                tileCompo.reset();
                this.listTileCompo[rol].push(tileCompo);
            }
        }
        this.emptyCells();
    }

    emptyCells() {
        this.cells = [];
        for (let rol = 0; rol < this.size; rol++) {
            this.cells.push([]);
            for (let col = 0; col < this.size; col++) {
                this.cells[rol].push(null);
            }
        }
    }

    cellsAvailable() {
        return !!this.availableCells().length;
    }

    availableCells() {
        let cells = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let tile = this.cells[x][y];
                if (!tile) {
                    cells.push({x: x, y: y});
                }
            }
        }

        return cells;
    }

    randomAvailableCell() {
        let cells = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    insertTile(cell, value) {
        const tileCompo = this.listTileCompo[cell.x][cell.y];
        tileCompo.addValue(value);
        tileCompo.zoomOut();
        this.cells[cell.x][cell.y] = tileCompo;
    }

    reset() {
        this.emptyCells();
        for (let rol = 0; rol < this.listTileCompo.length; rol++) {
            this.listTileCompo[rol].forEach((tile) => {
                tile.reset();
            });
        }
    }
}

