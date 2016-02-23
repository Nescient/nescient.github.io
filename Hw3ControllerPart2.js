// Copyright © Sam Savage 2016
/// <reference path="CaViewer.ts"/>

var length = 400;
const gMaxTimeStep: number = 1000;

function gRealMod(n: number, m: number): number {
    // javascript mod doesnt work with negative numbers
    //http://stackoverflow.com/a/17323608
    return ((n % m) + m) % m;
}

function gToHexString(val: number): string {
    var hexstring: string = Math.round(val * 0xFFFFFF).toString(16);
    hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
    return hexstring;
}

function gToGrayHexString(val: number): string {
    var hexstring: string = Math.round(val * 0xFFF).toString(16);
    hexstring = (hexstring.length < 3) ? "000".substr(hexstring.length - 3) + hexstring : hexstring;
    return hexstring;
}

function gToBlueHexString(val: number): string {
    var hexstring: string = Math.round(Math.min(val * 0xFF, 0xFF)).toString(16);
    hexstring = (hexstring.length < 2) ? "00".substr(hexstring.length - 2) + hexstring : hexstring;
    return hexstring;
}

class ColumnCount {
    private column: number = 0;
    private counts: { color: string, number }[] = [];
    private entropy: number[] = [];

    constructor(column: number) {
        this.column = column;
        return;
    }

    public addCount(str: string) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    }

    public updateEntropy(rowCount: number) {
        this.entropy[rowCount - 1] = this.getEntropy(rowCount);
    }

    public getEntropyVariance() {
        const offset: number = 50; // throw away everything under 50 timesteps
        if (this.entropy.length < offset) { return 0; }
        var mean: number = 0;
        for (var i: number = offset; i < this.entropy.length; ++i) {
            // mean += this.entropy[i] ? this.entropy[i] : 0;
            mean += this.entropy[i];
        }
        mean /= (this.entropy.length - offset);
        var variance: number = 0;
        for (var i: number = offset; i < this.entropy.length; ++i) {
            var delta: number = this.entropy[i] - mean;
            variance += (delta * delta);
        }
        return variance / (this.entropy.length - offset);
    }

    private getEntropy(rowCount: number): number {
        var entropy: number = 0;
        var valid_strings = Object.keys(this.counts);
        var total_count: number = 0;
        for (var i: number = 0; i < valid_strings.length; ++i) {
            var count = this.counts[valid_strings[i]];
            var weight = count / rowCount;
            entropy += weight * (Math.log(weight) / Math.log(2));
            total_count += count;
        }
        return 0 - entropy;
    }
}

class CellularAutomaton {
    private a: number = 0;
    private b: number = 0;
    private counts: ColumnCount[] = [];
    private currentRow: number[] = [];
    private rowCount: number = 0;

    constructor(a: number, b: number, row: number[]) {
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            this.rowCount = 1;
            for (var i: number = 0; i < this.currentRow.length; ++i) {
                // this.counts.push(new ColumnCount(i));
                this.counts[this.counts.length] = new ColumnCount(i);
            }
            this.updateCountsAndEntropy();
        }
        return;
    }

    public getA(): number {
        return this.a;
    }

    public getB(): number {
        return this.b;
    }

    public makeNewRow() {
        if (this.rowCount < gMaxTimeStep) {
            var len: number = this.currentRow.length;
            var new_row: number[] = [];
            for (var i: number = 0; i < len; ++i) {
                var previous: number = this.currentRow[gRealMod(i - 1, len)];
                var current: number = this.currentRow[gRealMod(i, len)];
                var next: number = this.currentRow[gRealMod(i + 1, len)];
                new_row.push(this.poly(this.a, this.b, previous, current, next));
                if (new_row[i] > 1) { alert(new_row[i]); }
                else if (new_row[i] < 0) { alert(new_row[i]); }
            }
            return this.setNextRow(new_row);
        }
        return;
    }

    // taken from Blair's ALife1Dim Java program
    private poly(a: number, b: number, u: number, x: number, v: number): number {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a + this.b)*u+(this.a-this.b)*v + this.b*u*v - 2*u*x*v)));
    }

    private setNextRow(row: number[]) {
        this.currentRow = row;
        ++this.rowCount;
        this.updateCountsAndEntropy();
        return;
    }

    private updateCountsAndEntropy() {
        for (var i: number = 0; i < this.currentRow.length; ++i) {
            var value: string =
                gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
            this.counts[i].updateEntropy(this.rowCount);
        }
    }

    public getEntropySigma(): number {
        var avg_variance: number = 0;
        for (var i: number = 0; i < this.counts.length; ++i) {
            avg_variance += this.counts[i].getEntropyVariance();
        }
        avg_variance /= this.counts.length;
        return Math.sqrt(avg_variance);
    }
}

class Hw3Controllerv2 extends BaseTimer {
    private svg: any;
    private statsBox: any;
    private data: CellularAutomaton[] = [];
    private increment: number = 0.1;
    private maxEntropy: number = 1;
    private minEntropy: number = 10;
    private timeStepIndex: number = 0;
    private boxCount: number = 0;
    private boxSize: number = 0;
    private caView: CaViewer = null;
    private caSelected: CellularAutomaton = null;

    constructor(elementId: string) {
        super(elementId);
        this.initializeCa();
        const svg_size: number = length * 3;
        var svg: any = d3.select("main").append("canvas");
        svg.attr("width", svg_size).attr("height", svg_size);
        var ctx = svg.node().getContext('2d');
        ctx.translate(0, svg.node().height);
        ctx.scale(1, -1);
        this.boxCount = (1 / this.increment) + 1;
        this.boxSize = svg_size / this.boxCount;

        svg.on("click", () => this.onMouse());

        this.svg = svg;
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3v2stats");
        this.statsBox.attr("class", "hwstats");
        return;
    }

    private initHelper(b: number, data: number[]) {
        if (b <= 1) {
            setTimeout(() => {
                var a: number = 0;
                while (a <= 1) {
                    this.data[this.data.length] = new CellularAutomaton(a, b, data);
                    a = parseFloat((a + this.increment).toFixed(3));
                }
                this.initHelper(parseFloat((b + this.increment).toFixed(3)), data);
            }, 30);
        }
    }

    initializeCa() {
        var b: number = 0;
        var data: number[] = [];
        for (var i: number = 0; i < length; ++i) {
            data.push(Math.random());
        }
        this.initHelper(parseFloat(b.toFixed(3)), data);
    }

    onMouse() {
        const width: number = parseInt(this.svg.style("width"));
        const height: number = parseInt(this.svg.style("height"));
        const num_boxes: number = (1 / this.increment) + 1;
        const box_size: number = width / num_boxes;
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number: number = Math.floor((mouse_pos[0] / width) * this.boxCount);
            var row_number: number = Math.floor(((height - mouse_pos[1]) / height) * this.boxCount);
            this.printStats(row_number, col_number);
        }
        return;
    }

    dostuff() {
        if (this.data.length > 0) {
            this.timestepOne();
        }
        //if (this.data.length > 0) {
        //    for (var i: number = 0; i < 10; ++i) {
        //        this.timestepOne();
        //    }
        //}
        return;
    }

    timestepOne() {
        var ca: CellularAutomaton = this.data[this.timeStepIndex];
        //  setTimeout(() => {
        ca.makeNewRow();
        var entropy: number = ca.getEntropySigma();
        if (entropy > this.maxEntropy) {
            this.maxEntropy = entropy
        }
        if (entropy < this.minEntropy) {
            this.minEntropy = entropy
        }
        if (this.maxEntropy != this.minEntropy) {
            entropy = (entropy - this.minEntropy) / (this.maxEntropy - this.minEntropy);
        }
        this.graphHeatMap(
            entropy,
            ca.getA() / this.increment,
            ca.getB() / this.increment,
            //"#" + gToGrayHexString(Math.round(entropy * 100) / 100)
            "#0000" + gToBlueHexString(entropy)
        );
        // return;
        // }, 0)
        //if (this.timeStepIndex < this.data.length / 2)
        ++this.timeStepIndex;
        if (this.timeStepIndex >= this.data.length) {
            this.timeStepIndex = 0;
        }

    }

    graphHeatMap(value: number, x: number, y: number, color: string) {
        var context = this.svg.node().getContext("2d");
        context.beginPath();
        context.rect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
        context.fillStyle = color;
        context.fill();
        context.closePath();
        return;
    }


    printStats(row: number, col: number) {
        const index: number = (row * this.boxCount) + col;
        if (row >= 0 && col >= 0 && (index < this.data.length)) {
            var ca: CellularAutomaton = this.data[index];
            if (!this.caSelected || this.caSelected.getA() != ca.getA() || this.caSelected.getB() != ca.getB()) {
                this.caSelected = ca;
                this.statsBox.selectAll("p").remove();

                var info_p = this.statsBox.append("p");
                var statstr: string = "row " + row + ", col " + col + " where a=" + ca.getA() + " and b=" + ca.getB();
                info_p.text(statstr);
                var entropy_p = this.statsBox.append("p");
                entropy_p.text("entropy standard deviation: " + ca.getEntropySigma());

                if (this.caView) {
                    this.caView.stop();
                    delete this.caView;
                    this.statsBox.selectAll("canvas").remove();
                    var svg: any = this.statsBox.append("canvas").attr("width", length).attr("height", length);
                    this.caView = new CaViewer(svg, length, ca.getA(), ca.getB());
                    this.caView.start();
                }

                else {
                    var svg: any = this.statsBox.append("canvas").attr("width", length).attr("height", length);
                    this.caView = new CaViewer(svg, length, ca.getA(), ca.getB());
                    this.caView.start();
                }
            }
        

            // entropy_p.text("should be " + (col * this.increment).toString() + ", " + (row * this.increment).toString());

           
        } return;
    }
}
