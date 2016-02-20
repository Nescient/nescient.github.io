var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var gMaxTimeStep = 4000;
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
        this.column = column;
        return;
    }
    ColumnCount.prototype.addCount = function (str) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
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
            this.updateCounts();
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
        return (0.5 - 0.5 * Math.cos(Math.PI * (a + (a - b) * v + b * u * v - 2 * u * x * v)));
    };
    CellularAutomaton.prototype.setNextRow = function (row) {
        this.currentRow = row;
        ++this.rowCount;
        this.updateCounts();
        return;
    };
    CellularAutomaton.prototype.updateCounts = function () {
        for (var i = 0; i < this.currentRow.length; ++i) {
            var value = gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
        }
    };
    CellularAutomaton.prototype.getEntropy = function () {
        var entropy = this.counts[0].getEntropy(this.rowCount);
        for (var i = 1; i < this.counts.length; ++i) {
            var new_entropy = this.counts[i].getEntropy(this.rowCount);
            if (new_entropy < entropy) {
                entropy = new_entropy;
            }
        }
        return entropy;
    };
    return CellularAutomaton;
})();
var Hw3Controllerv2 = (function (_super) {
    __extends(Hw3Controllerv2, _super);
    function Hw3Controllerv2(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.data = [];
        this.increment = 0.05;
        this.maxEntropy = 1;
        this.minEntropy = 10;
        this.timeStepIndex = 0;
        var a = 0;
        var b = 0;
        var data = [];
        for (var i = 0; i < length; ++i) {
            data.push(Math.random());
        }
        //for (var b: number = 0; b <= 1; b += this.increment) {
        //    for (var a: number = 0; a <= 1; a += this.increment) {
        //        //var ca: CellularAutomaton = new CellularAutomaton(a, b, data);
        //        //this.data.push(ca);
        //        this.data[this.data.length] = new CellularAutomaton(a, b, data);
        //    }
        //}
        var b = 0;
        //for (var a: number = 0; a <= 1; a += this.increment) {
        //    this.data[this.data.length] = new CellularAutomaton(a, b, data);
        //}
        //b += this.increment;
        //setTimeout(() => {
        //    if (b <= 1) {
        //        for (var a: number = 0; a <= 1; a += this.increment) {
        //            this.data[this.data.length] = new CellularAutomaton(a, b, data);
        //        }
        //        setTimeout(() => {
        //            if (b <= 1) {
        //                for (var a: number = 0; a <= 1; a += this.increment) {
        //                    this.data[this.data.length] = new CellularAutomaton(a, b, data);
        //                }
        //            }
        //            b += this.increment;
        //        }, 30);
        //    }
        //    b += this.increment;
        //}, 30);
        //initialize() {
        //    if (b <= 1) {
        //        for (var a: number = 0; a <= 1; a += this.increment) {
        //            this.data[this.data.length] = new CellularAutomaton(a, b, data);
        //        }
        //        setTimeout(() => initialize(), 30);
        //        b += this.increment;
        //    }
        //}
        //initialize();
        this.initializeCa();
        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 3).attr("height", length * 3);
        var ctx = svg.node().getContext('2d');
        ctx.translate(0, svg.node().height);
        ctx.scale(1, -1);
        svg.on("mousemove", function () { return _this.onMouse(); });
        this.svg = svg;
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3stats");
        return;
    }
    Hw3Controllerv2.prototype.initHelper = function (b, data) {
        var _this = this;
        if (b <= 1) {
            for (var a = 0; a <= 1; a += this.increment) {
                this.data[this.data.length] = new CellularAutomaton(a, b, data);
            }
            setTimeout(function () { return _this.initHelper(b, data); }, 30);
            b += this.increment;
        }
    };
    Hw3Controllerv2.prototype.initializeCa = function () {
        var b = 0;
        var data = [];
        for (var i = 0; i < length; ++i) {
            data.push(Math.random());
        }
        this.initHelper(b, data);
    };
    Hw3Controllerv2.prototype.onMouse = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number = Math.floor(mouse_pos[0] / 2);
            var row_number = Math.floor(mouse_pos[1] / 2);
        }
        return;
    };
    Hw3Controllerv2.prototype.dostuff = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var num_boxes = (1 / this.increment) + 1;
        //for (var i: number = 0; i < this.data.length; ++i)
        {
            var ca = this.data[this.timeStepIndex];
            //  setTimeout(() => {
            ca.makeNewRow();
            var entropy = ca.getEntropy();
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
            ++this.timeStepIndex;
            if (this.timeStepIndex >= this.data.length) {
                this.timeStepIndex = 0;
            }
        }
        return;
    };
    Hw3Controllerv2.prototype.graphHeatMap = function (value, x, y, color) {
        var total_width = parseInt(this.svg.style("width"));
        var total_height = parseInt(this.svg.style("height"));
        var num_boxes = (1 / this.increment) + 1;
        var size = total_width / num_boxes;
        if (x.toFixed() == "5" && y.toFixed() == "5") {
            console.log(x.toString() + "," + y.toString() + ":" + value.toString());
            console.log(color);
        }
        var context = this.svg.node().getContext("2d");
        context.beginPath();
        context.rect(x * size, y * size, size, size);
        context.fillStyle = color;
        context.fill();
        context.closePath();
        return;
    };
    return Hw3Controllerv2;
})(BaseTimer);
//# sourceMappingURL=Hw3ControllerPart2.js.map