
import { random } from './utils';


export interface Kase{

    connections: string[];
    addConnection(kase: Kase): void;
    positionKey(): string;
}

// Kase class
export class Kase2D implements Kase{

    public connections: string[] = []
    constructor(public x: number, public y: number) {}

    addConnection(kase: Kase) {
        this.connections.push(kase.positionKey())
    }


    positionKey() {
        return "" + this.x + "/" + this.y
    }
}

// Abstract Tableau class
export abstract class Tableau<T extends Kase> {
    protected cases: T[][];

    constructor(cases: T[][]) {
        this.cases = cases;
    }

    get sizeX(): number {
        return this.cases.length;
    }
    get sizeY(): number {
        return this.cases[0].length;
    }
    abstract getKase(x: number, y: number): T | null;

    abstract neighbors(kase: T): T[];

     allKases(): T[] {
        return this.cases.flat();
    }
     randomKase(): T{
        return random(random(this.cases));
    }

    static initialize<T extends Kase>(width: number, height: number, build:  (x: number, y: number) => T): Tableau<T> {
        const cases: T[][] = [];
        for (let x = 0; x < width; x++) {
            const row: T[] = [];
            for (let y = 0; y < height; y++) {
                row.push(build(x, y));
            }
            cases.push(row);
        }
        return new (this as any)(cases);
    }
}

// NormalTableau class
export class NormalTableau<TypeKase extends Kase2D> extends Tableau<TypeKase> {
    getKase(x: number, y: number): TypeKase | null {
        if (x >= 0 && y >= 0 && x < this.cases.length && y < this.cases[0].length) {
            return this.cases[x][y];
        }
        return null;
    }

    neighbors(kase: TypeKase): TypeKase[] {
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 }
        ];
        const neighbors: TypeKase[] = [];
        for (const { dx, dy } of directions) {
            const neighbor = this.getKase(kase.x + dx, kase.y + dy);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
}

// HexagonalTableau class
export class HexagonalTableau<TypeKase extends Kase2D> extends Tableau<TypeKase> {
    getKase(x: number, y: number): TypeKase | null {
        if (x >= 0 && y >= 0 && x < this.cases.length && y < this.cases[0].length) {
            return this.cases[x][y];
        }
        return null;
    }

    neighbors(kase: TypeKase): TypeKase[] {
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: -1 }
        ];
        const neighbors: TypeKase[] = [];
        for (const { dx, dy } of directions) {
            const neighbor = this.getKase(kase.x + dx, kase.y + dy);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
}






export function buildPassingMap<T extends Kase2D>(tableau:Tableau<T>):boolean[][]{

    const map:boolean[][]=[]
    for (let i = 0; i < tableau.sizeX*2; i++) {
        map[i]=[]
        for (let j = 0; j < tableau.sizeY*2; j++) {
            map[i][j]=false

        }
    }
    tableau.allKases().forEach((kase)=>{
        map[kase.x*2][kase.y*2]=true
        kase.connections.forEach((connection)=>{
            const [x,y,z]=connection.split("/").map((val)=>parseInt(val))

            map[(x*2+kase.x*2)/2][(y*2+kase.y*2)/2]=true

        })
    })
    return map
}
