// Copyright © Sam Savage 2016
/// <reference path="CaViewer.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var gMaxTimeStep = 1000;
function gRealMod(n, m) {
    // javascript mod doesnt work with negative numbers
    //http://stackoverflow.com/a/17323608
    return ((n % m) + m) % m;
}
function gToHexString(val) {
    var hexstring = Math.round(val * 0xFFFFFF).toString(16);
    hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
    return hexstring;
}
function gToGrayHexString(val) {
    var hexstring = Math.round(val * 0xFFF).toString(16);
    hexstring = (hexstring.length < 3) ? "000".substr(hexstring.length - 3) + hexstring : hexstring;
    return hexstring;
}
function gToBlueHexString(val) {
    var hexstring = Math.round(Math.min(val * 0xFF, 0xFF)).toString(16);
    hexstring = (hexstring.length < 2) ? "00".substr(hexstring.length - 2) + hexstring : hexstring;
    return hexstring;
}
var ColumnCount = (function () {
    function ColumnCount(column) {
        this.column = 0;
        this.counts = [];
        this.entropy = [];
        this.column = column;
        return;
    }
    ColumnCount.prototype.addCount = function (str) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    };
    ColumnCount.prototype.updateEntropy = function (rowCount) {
        this.entropy[rowCount - 1] = this.getEntropy(rowCount);
    };
    ColumnCount.prototype.getEntropyVariance = function () {
        var offset = 50; // throw away everything under 50 timesteps
        if (this.entropy.length < offset) {
            return 0;
        }
        var mean = 0;
        for (var i = offset; i < this.entropy.length; ++i) {
            // mean += this.entropy[i] ? this.entropy[i] : 0;
            mean += this.entropy[i];
        }
        mean /= (this.entropy.length - offset);
        var variance = 0;
        for (var i = offset; i < this.entropy.length; ++i) {
            var delta = this.entropy[i] - mean;
            variance += (delta * delta);
        }
        return variance / (this.entropy.length - offset);
    };
    ColumnCount.prototype.getEntropy = function (rowCount) {
        var entropy = 0;
        var valid_strings = Object.keys(this.counts);
        var total_count = 0;
        for (var i = 0; i < valid_strings.length; ++i) {
            var count = this.counts[valid_strings[i]];
            var weight = count / rowCount;
            entropy += weight * (Math.log(weight) / Math.log(2));
            total_count += count;
        }
        return 0 - entropy;
    };
    return ColumnCount;
})();
var CellularAutomaton = (function () {
    function CellularAutomaton(a, b, row) {
        this.a = 0;
        this.b = 0;
        this.counts = [];
        this.currentRow = [];
        this.rowCount = 0;
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            this.rowCount = 1;
            for (var i = 0; i < this.currentRow.length; ++i) {
                // this.counts.push(new ColumnCount(i));
                this.counts[this.counts.length] = new ColumnCount(i);
            }
            this.updateCountsAndEntropy();
        }
        return;
    }
    CellularAutomaton.prototype.getA = function () {
        return this.a;
    };
    CellularAutomaton.prototype.getB = function () {
        return this.b;
    };
    CellularAutomaton.prototype.makeNewRow = function () {
        if (this.rowCount < gMaxTimeStep) {
            var len = this.currentRow.length;
            var new_row = [];
            for (var i = 0; i < len; ++i) {
                var previous = this.currentRow[gRealMod(i - 1, len)];
                var current = this.currentRow[gRealMod(i, len)];
                var next = this.currentRow[gRealMod(i + 1, len)];
                new_row.push(this.poly(this.a, this.b, previous, current, next));
                if (new_row[i] > 1) {
                    alert(new_row[i]);
                }
                else if (new_row[i] < 0) {
                    alert(new_row[i]);
                }
            }
            return this.setNextRow(new_row);
        }
        return;
    };
    // taken from Blair's ALife1Dim Java program
    CellularAutomaton.prototype.poly = function (a, b, u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI *
            (a + (a + b) * u +
                (a - b) * v +
                b * u * v -
                2 * u * x * v)));
    };
    CellularAutomaton.prototype.setNextRow = function (row) {
        this.currentRow = row;
        ++this.rowCount;
        this.updateCountsAndEntropy();
        return;
    };
    CellularAutomaton.prototype.updateCountsAndEntropy = function () {
        for (var i = 0; i < this.currentRow.length; ++i) {
            var value = gToHexString(this.currentRow[gRealMod(i - 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]);
            this.counts[i].addCount(value);
            this.counts[i].updateEntropy(this.rowCount);
        }
    };
    CellularAutomaton.prototype.getEntropySigma = function () {
        var avg_variance = 0;
        for (var i = 0; i < this.counts.length; ++i) {
            avg_variance += this.counts[i].getEntropyVariance();
        }
        avg_variance /= this.counts.length;
        return Math.sqrt(avg_variance);
    };
    return CellularAutomaton;
})();
var Hw3Controllerv2 = (function (_super) {
    __extends(Hw3Controllerv2, _super);
    function Hw3Controllerv2(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.data = [];
        this.increment = 0.1;
        this.maxEntropy = 1;
        this.minEntropy = 10;
        this.timeStepIndex = 0;
        this.boxCount = 0;
        this.boxSize = 0;
        this.caView = null;
        this.caSelected = null;
        this.initializeCa();
        var svg_size = length * 3;
        var svg = d3.select("main").append("canvas");
        svg.attr("width", svg_size).attr("height", svg_size);
        var ctx = svg.node().getContext('2d');
        ctx.translate(0, svg.node().height);
        ctx.scale(1, -1);
        this.boxCount = (1 / this.increment) + 1;
        this.boxSize = svg_size / this.boxCount;
        svg.on("click", function () { return _this.onMouse(); });
        this.svg = svg;
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3v2stats");
        this.statsBox.attr("class", "hwstats");
        return;
    }
    Hw3Controllerv2.prototype.initHelper = function (b, data) {
        var _this = this;
        if (b <= 1) {
            setTimeout(function () {
                var a = 0;
                while (a <= 1) {
                    _this.data[_this.data.length] = new CellularAutomaton(a, b, data);
                    a = parseFloat((a + _this.increment).toFixed(3));
                }
                _this.initHelper(parseFloat((b + _this.increment).toFixed(3)), data);
            }, 30);
        }
    };
    Hw3Controllerv2.prototype.initializeCa = function () {
        var b = 0;
        var data = [];
        for (var i = 0; i < length; ++i) {
            data.push(Math.random());
        }
        this.initHelper(parseFloat(b.toFixed(3)), data);
    };
    Hw3Controllerv2.prototype.onMouse = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var num_boxes = (1 / this.increment) + 1;
        var box_size = width / num_boxes;
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number = Math.floor((mouse_pos[0] / width) * this.boxCount);
            var row_number = Math.floor(((height - mouse_pos[1]) / height) * this.boxCount);
            this.printStats(row_number, col_number);
        }
        return;
    };
    Hw3Controllerv2.prototype.dostuff = function () {
        if (this.data.length > 0) {
            this.timestepOne();
        }
        //if (this.data.length > 0) {
        //    for (var i: number = 0; i < 10; ++i) {
        //        this.timestepOne();
        //    }
        //}
        return;
    };
    Hw3Controllerv2.prototype.timestepOne = function () {
        var ca = this.data[this.timeStepIndex];
        //  setTimeout(() => {
        ca.makeNewRow();
        var entropy = ca.getEntropySigma();
        if (entropy > this.maxEntropy) {
            this.maxEntropy = entropy;
        }
        if (entropy < this.minEntropy) {
            this.minEntropy = entropy;
        }
        if (this.maxEntropy != this.minEntropy) {
            entropy = (entropy - this.minEntropy) / (this.maxEntropy - this.minEntropy);
        }
        this.graphHeatMap(entropy, ca.getA() / this.increment, ca.getB() / this.increment, 
        //"#" + gToGrayHexString(Math.round(entropy * 100) / 100)
        "#0000" + gToBlueHexString(entropy));
        // return;
        // }, 0)
        //if (this.timeStepIndex < this.data.length / 2)
        ++this.timeStepIndex;
        if (this.timeStepIndex >= this.data.length) {
            this.timeStepIndex = 0;
        }
    };
    Hw3Controllerv2.prototype.graphHeatMap = function (value, x, y, color) {
        var context = this.svg.node().getContext("2d");
        context.beginPath();
        context.rect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
        context.fillStyle = color;
        context.fill();
        context.closePath();
        return;
    };
    Hw3Controllerv2.prototype.printStats = function (row, col) {
        var index = (row * this.boxCount) + col;
        if (row >= 0 && col >= 0 && (index < this.data.length)) {
            var ca = this.data[index];
            if (!this.caSelected || this.caSelected.getA() != ca.getA() || this.caSelected.getB() != ca.getB()) {
                this.caSelected = ca;
                this.statsBox.selectAll("p").remove();
                var info_p = this.statsBox.append("p");
                var statstr = "row " + row + ", col " + col + " where a=" + ca.getA() + " and b=" + ca.getB();
                info_p.text(statstr);
                var entropy_p = this.statsBox.append("p");
                entropy_p.text("entropy standard deviation: " + ca.getEntropySigma());
                if (this.caView) {
                    this.caView.stop();
                    delete this.caView;
                    this.statsBox.selectAll("canvas").remove();
                    var svg = this.statsBox.append("canvas").attr("width", length).attr("height", length);
                    this.caView = new CaViewer(svg, length, ca.getA(), ca.getB());
                    this.caView.start();
                }
                else {
                    var svg = this.statsBox.append("canvas").attr("width", length).attr("height", length);
                    this.caView = new CaViewer(svg, length, ca.getA(), ca.getB());
                    this.caView.start();
                }
            }
        }
        return;
    };
    return Hw3Controllerv2;
})(BaseTimer);
//# sourceMappingURL=Hw3ControllerPart2.js.map