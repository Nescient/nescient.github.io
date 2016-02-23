// Copyright © Sam Savage 2016
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gMinTimeStep = 500; // timesteps below this will not be factored into entropy
var ColumnCountv2 = (function () {
    function ColumnCountv2(column) {
        this.column = 0;
        this.counts = [];
        this.entropy = [];
        this.column = column;
        return;
    }
    ColumnCountv2.prototype.addCount = function (str) {
        this.counts[str] = (this.counts[str] ? this.counts[str] + 1 : 1);
        return;
    };
    ColumnCountv2.prototype.updateEntropy = function (rowCount) {
        this.entropy[rowCount - 1] = this.getEntropy(rowCount);
    };
    ColumnCountv2.prototype.getAvgEntropy = function () {
        if (this.entropy.length > 0) {
            var mean = 0;
            for (var i = 0; i < this.entropy.length; ++i) {
                mean += this.entropy[i];
            }
            return mean / this.entropy.length;
        }
        return 0;
    };
    ColumnCountv2.prototype.getEntropyVariance = function () {
        if (this.counts.length > 0) {
            var mean = this.getAvgEntropy();
            var variance = 0;
            for (var i = 0; i < this.entropy.length; ++i) {
                var delta = this.entropy[i] - mean;
                variance += (delta * delta);
            }
            return variance / this.entropy.length;
        }
        return 0;
    };
    ColumnCountv2.prototype.getEntropy = function (rowCount) {
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
    return ColumnCountv2;
})();
var CellularAutomatonv2 = (function () {
    function CellularAutomatonv2(a, b, row) {
        this.a = 0;
        this.b = 0;
        this.counts = [];
        this.currentRow = [];
        this.rowCount = 0;
        this.ignoreCount = 0;
        this.a = a;
        this.b = b;
        this.currentRow = row;
        if (this.currentRow) {
            for (var i = 0; i < this.currentRow.length; ++i) {
                this.counts[this.counts.length] = new ColumnCountv2(i);
            }
        }
        return;
    }
    CellularAutomatonv2.prototype.getA = function () {
        return this.a;
    };
    CellularAutomatonv2.prototype.getB = function () {
        return this.b;
    };
    CellularAutomatonv2.prototype.makeNewRow = function () {
        if (this.rowCount < gMaxTimeStep) {
            var len = this.currentRow.length;
            if ((this.rowCount > (gMaxTimeStep / 4)) && (this.getAvgEntropy() == 0)) {
                return false;
            }
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
            this.setNextRow(new_row);
            return true;
        }
        return false;
    };
    // taken from Blair's ALife1Dim Java program
    CellularAutomatonv2.prototype.poly = function (a, b, u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI *
            (a + (a + b) * u +
                (a - b) * v +
                b * u * v -
                2 * u * x * v)));
    };
    CellularAutomatonv2.prototype.setNextRow = function (row) {
        this.currentRow = row;
        if (this.ignoreCount <= gMinTimeStep) {
            ++this.ignoreCount;
        }
        if (this.ignoreCount > gMinTimeStep) {
            ++this.rowCount;
            this.updateCountsAndEntropy();
        }
        return;
    };
    CellularAutomatonv2.prototype.updateCountsAndEntropy = function () {
        for (var i = 0; i < this.currentRow.length; ++i) {
            var value = gToHexString(this.currentRow[gRealMod(i, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 1, this.currentRow.length)]) +
                gToHexString(this.currentRow[gRealMod(i + 2, this.currentRow.length)]);
            this.counts[i].addCount(value);
            this.counts[i].updateEntropy(this.rowCount);
        }
    };
    CellularAutomatonv2.prototype.getAvgEntropy = function () {
        var avg = 0;
        for (var i = 0; i < this.counts.length; ++i) {
            avg += this.counts[i].getAvgEntropy();
        }
        return avg / this.counts.length;
    };
    CellularAutomatonv2.prototype.getEntropySigma = function () {
        var avg = 0;
        for (var i = 0; i < this.counts.length; ++i) {
            avg += this.counts[i].getEntropyVariance();
        }
        avg /= this.counts.length;
        return Math.sqrt(avg);
    };
    return CellularAutomatonv2;
})();
var Hw3Controllerv3 = (function (_super) {
    __extends(Hw3Controllerv3, _super);
    function Hw3Controllerv3(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.increment = 0.05;
        this.maxEntropy = 10;
        this.minEntropy = 0;
        this.timeStepIndex = 0;
        this.boxCount = 0;
        this.boxSize = 0;
        this.ca = null;
        this.a = 0;
        this.b = 0;
        this.caIC = [];
        this.doneCAs = [];
        this.caView = null;
        this.caSelected = null;
        console.log("constructor");
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
        this.statsBox.attr("id", "hw3v3stats");
        this.statsBox.attr("class", "hwstats");
        for (var i = 0; i < length; ++i) {
            this.caIC.push(Math.random());
        }
        this.ca = this.nextCA();
        return;
    }
    Hw3Controllerv3.prototype.onMouse = function () {
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
    Hw3Controllerv3.prototype.dostuff = function () {
        if (this.ca.makeNewRow()) {
            var entropy = this.ca.getAvgEntropy();
            if (entropy > this.maxEntropy) {
                this.maxEntropy = entropy;
            }
            if (entropy < this.minEntropy) {
                this.minEntropy = entropy;
            }
            if (this.maxEntropy != this.minEntropy) {
                entropy = (entropy - this.minEntropy) / (this.maxEntropy - this.minEntropy);
            }
            this.graphHeatMap(entropy, this.ca.getA() / this.increment, this.ca.getB() / this.increment, "#0000" + gToBlueHexString(entropy));
        }
        else {
            this.doneCAs.push({
                a: this.ca.getA(),
                b: this.ca.getB(),
                e: this.ca.getAvgEntropy()
            });
            delete this.ca;
            this.ca = this.nextCA();
        }
        if (this.ca == null) {
            this.stop();
        }
        return;
    };
    Hw3Controllerv3.prototype.graphHeatMap = function (value, x, y, color) {
        var context = this.svg.node().getContext("2d");
        context.beginPath();
        context.rect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
        context.fillStyle = color;
        context.fill();
        context.closePath();
        return;
    };
    Hw3Controllerv3.prototype.nextCA = function () {
        var ca = null;
        if (this.b < 1) {
            ca = new CellularAutomatonv2(this.a, this.b, this.caIC);
            if (this.a < 1) {
                this.a = parseFloat((this.a + this.increment).toFixed(3));
            }
            else {
                this.a = 0;
                this.b = parseFloat((this.b + this.increment).toFixed(3));
            }
        }
        return ca;
    };
    Hw3Controllerv3.prototype.printStats = function (row, col) {
        var index = (row * this.boxCount) + col;
        var cainfo = (this.ca) ?
            { a: this.ca.getA(), b: this.ca.getB(), e: this.ca.getAvgEntropy() } :
            { a: -1, b: -1, e: -1 };
        if (row >= 0 && col >= 0 && (index < this.doneCAs.length)) {
            cainfo = this.doneCAs[index];
        }
        if (!this.caSelected || this.caSelected.a != cainfo.a || this.caSelected.b != cainfo.b) {
            this.caSelected = cainfo;
            this.statsBox.selectAll("p").remove();
            var info_p = this.statsBox.append("p");
            var entropy_p = this.statsBox.append("p");
            var stats_p = this.statsBox.append("p");
            var statstr = "row " + row + ", col " + col + " where a=" + cainfo.a + " and b=" + cainfo.b;
            info_p.text(statstr);
            entropy_p.text("average entropy: " + cainfo.e);
            if (this.ca) {
                stats_p.text("row count: " + this.ca.rowCount + "(" + this.ca.ignoreCount + ")");
            }
            if (this.caView) {
                this.caView.stop();
                delete this.caView;
                this.statsBox.selectAll("canvas").remove();
            }
            var svg = this.statsBox.append("canvas").attr("width", length).attr("height", length);
            this.caView = new CaViewer(svg, length, cainfo.a, cainfo.b);
            this.caView.start();
        }
        else {
            var row_count = this.ca ? this.ca.rowCount : -1;
            var ignore_count = this.ca ? this.ca.ignoreCount : -1;
            this.statsBox.selectAll("p")[0].map(function (d, i) {
                if (d.textContent.indexOf("entropy") != -1) {
                    d.textContent = ("average entropy: " + cainfo.e);
                }
                else if (d.textContent.indexOf("row count") != -1) {
                    d.textContent = ("row count: " + row_count + "(" + ignore_count + ")");
                }
            });
        }
        return;
    };
    return Hw3Controllerv3;
})(BaseTimer);
//# sourceMappingURL=Hw3ControllerFinal.js.map