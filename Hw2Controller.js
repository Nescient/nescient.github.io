var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var Hw2Controller = (function (_super) {
    __extends(Hw2Controller, _super);
    function Hw2Controller(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.currentRow = [];
        this.data = [];
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i = 0; i < length; ++i) {
            //this.currentRow.push(Math.random() < 0.5);
            this.currentRow.push((i == (length / 2)));
        }
        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        svg.on("mousemove", function () { return _this.onMouse(); });
        this.svg = svg;
        this.graphRow(this.currentRow, 0);
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw2stats");
        return;
    }
    Hw2Controller.prototype.onMouse = function () {
        var width = parseInt(this.svg.style("width"));
        var height = parseInt(this.svg.style("height"));
        var mouse_event = d3.event["currentTarget"];
        if (mouse_event) {
            var mouse_pos = d3.mouse(mouse_event);
            var col_number = Math.floor(mouse_pos[0] / 2);
            var row_number = Math.floor(mouse_pos[1] / 2);
            var width = 3;
            if (row_number < this.data.length) {
                var stats = this.getStats(this.data, row_number, col_number, width);
                this.printStats(row_number, col_number, width, stats);
            }
        }
        return;
    };
    Hw2Controller.prototype.dostuff = function () {
        var next_row = this.nextRow(this.currentRow);
        this.data.push(this.currentRow);
        this.graphRow(next_row, this.data.length);
        this.currentRow = next_row;
        return;
    };
    Hw2Controller.prototype.realMod = function (n, m) {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    };
    Hw2Controller.prototype.nextRow = function (row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[this.realMod(i - 1, row.length)];
            var current = row[this.realMod(i, row.length)];
            var next = row[this.realMod(i + 1, row.length)];
            rval[i] = this.lookupRule(previous, current, next);
        }
        return rval;
    };
    Hw2Controller.prototype.lookupRule = function (p, c, n) {
        // https://en.wikipedia.org/wiki/Rule_110
        // current state: 111 	110 	101 	100 	011 	010 	001 	000
        // new state:      0     1       1       0       1       1       1       0
        var states = [false, true, true, true, false, true, true, false];
        var index = (p ? 4 : 0) + (c ? 2 : 0) + (n ? 1 : 0);
        return (index < states.length ? states[index] : false);
    };
    Hw2Controller.prototype.graphRow = function (row, yIndex) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            if (row[i]) {
                context.fillStyle = "#000";
                context.fill();
            }
            context.closePath();
        });
    };
    Hw2Controller.prototype.getStats = function (data, rowIndex, colIndex, width) {
        var rval = Array(Math.pow(2, width));
        for (var i = 0; i < rowIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            var value = this.getNumber(row, start_index, local_width);
            rval[value] = (rval[value] ? rval[value] + 1 : 1);
        }
        return rval;
    };
    Hw2Controller.prototype.getNumber = function (data, start, length) {
        var rval = 0;
        for (var i = start; i < (start + length); ++i) {
            rval += (data[this.realMod(i, data.length)] ? (1 << (i - start)) : 0);
        }
        return rval;
    };
    Hw2Controller.prototype.printStats = function (row, col, width, stats) {
        this.statsBox.selectAll("p").remove();
        var count_p = this.statsBox.append("p");
        var statstr = "count for row " + row + ", col " + col + " (length " + width + "): ";
        count_p.text(statstr + stats.toString());
        var total_count = 0;
        var weights = Array(stats.length);
        var entropy = 0;
        for (var i = 0; i < stats.length; ++i) {
            if (stats[i]) {
                weights[i] = stats[i] / row;
                entropy += weights[i] * (Math.log(weights[i]) / Math.log(2));
            }
            total_count += (stats[i] ? stats[i] : 0);
        }
        if (total_count != row) {
            this.statsBox.append("p").text("total count != row:  " + total_count.toString() + " != " + row.toString());
            alert("totalcount != row");
        }
        var fract_p = this.statsBox.append("p");
        statstr = "weights: [";
        for (var i = 0; i < weights.length; ++i) {
            if (weights[i]) {
                statstr += weights[i].toFixed(3);
            }
            if (i < weights.length - 1) {
                statstr += ",";
            }
        }
        statstr += "]";
        fract_p.text(statstr);
        var entropy_p = this.statsBox.append("p");
        entropy_p.text("shannon's entropy: " + (0 - entropy));
        return;
    };
    return Hw2Controller;
})(BaseTimer);
//# sourceMappingURL=Hw2Controller.js.map