import {GameConfig, MoveDir, MoveAction} from "./GameConfig2048";

export class BoardLogic2048 {
    public cells: number[][] = [];
    public score: number = 0;

    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.cells = Array.from({length: GameConfig.GRID_SIZE}, () => new Array(GameConfig.GRID_SIZE).fill(0));
    }

    move(dir: MoveDir): { moved: boolean, actions: MoveAction[] } {
        const vector = this._getVector(dir);
        const traversals = this._buildTraversals(vector);
        let moved = false;
        let actions: MoveAction[] = [];
        const mergedCells = this.cells.map(row => row.map(() => false));

        traversals.x.forEach(r => {
            traversals.y.forEach(c => {
                const value = this.cells[r][c];
                if (value === 0) return;

                const pos = this._findFarthestPosition({r, c}, vector);
                const next = pos.next;

                if (this._isValidPos(next) && this.cells[next.r][next.c] === value && !mergedCells[next.r][next.c]) {
                    const newValue = value * 2;
                    this.cells[next.r][next.c] = newValue;
                    this.cells[r][c] = 0;
                    mergedCells[next.r][next.c] = true;
                    this.score += newValue;
                    moved = true;
                    actions.push({from: {r, c}, to: next, isMerge: true, newValue});
                } else if (pos.farthest.r !== r || pos.farthest.c !== c) {
                    this.cells[pos.farthest.r][pos.farthest.c] = value;
                    this.cells[r][c] = 0;
                    moved = true;
                    actions.push({from: {r, c}, to: pos.farthest, isMerge: false, newValue: value});
                }
            });
        });

        return {moved, actions};
    }

    addRandomTile(): { r: number, c: number, value: number } | null {
        const empties = [];
        this.cells.forEach((row, r) => row.forEach((val, c) => val === 0 && empties.push({r, c})));
        if (empties.length === 0) return null;

        const pos = empties[Math.floor(Math.random() * empties.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        this.cells[pos.r][pos.c] = value;
        return {...pos, value};
    }

    isGameOver(): boolean {
        for (let r = 0; r < GameConfig.GRID_SIZE; r++) {
            for (let c = 0; c < GameConfig.GRID_SIZE; c++) {
                if (this.cells[r][c] === 0) return false;
                const val = this.cells[r][c];
                if (c < GameConfig.GRID_SIZE - 1 && this.cells[r][c + 1] === val) return false;
                if (r < GameConfig.GRID_SIZE - 1 && this.cells[r + 1][c] === val) return false;
            }
        }
        return true;
    }

    private _getVector(dir: MoveDir) {
        const map = {
            [MoveDir.UP]: {r: -1, c: 0},
            [MoveDir.DOWN]: {r: 1, c: 0},
            [MoveDir.LEFT]: {r: 0, c: -1},
            [MoveDir.RIGHT]: {r: 0, c: 1}
        };
        return map[dir];
    }

    private _buildTraversals(vector: { r: number, c: number }) {
        let traversals = {x: [], y: []};
        for (let i = 0; i < GameConfig.GRID_SIZE; i++) {
            traversals.x.push(i);
            traversals.y.push(i);
        }
        if (vector.r === 1) traversals.x.reverse();
        if (vector.c === 1) traversals.y.reverse();
        return traversals;
    }

    private _findFarthestPosition(cell: { r: number, c: number }, vector: { r: number, c: number }) {
        let previous;
        do {
            previous = cell;
            cell = {r: previous.r + vector.r, c: previous.c + vector.c};
        } while (this._isValidPos(cell) && this.cells[cell.r][cell.c] === 0);
        return {farthest: previous, next: cell};
    }

    private _isValidPos(cell: { r: number, c: number }) {
        return cell.r >= 0 && cell.r < GameConfig.GRID_SIZE && cell.c >= 0 && cell.c < GameConfig.GRID_SIZE;
    }
}