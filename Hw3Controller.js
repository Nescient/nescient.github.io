var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var length = 400;
var Hw3Controller = (function (_super) {
    __extends(Hw3Controller, _super);
    function Hw3Controller(elementId) {
        var _this = this;
        _super.call(this, elementId);
        this.currentRow = [];
        this.data = [];
        this.a = Math.random();
        this.b = Math.random();
        // http://stackoverflow.com/a/20066663
        //this.currentRow = Array.apply(null, { length: length }).map(Function.call, Math.random);
        for (var i = 0; i < length; ++i) {
            this.currentRow.push(Math.random());
        }
        console.log("a is " + this.a.toString() + ", b is " + this.b.toString());
        console.log(this.currentRow);
        var svg = d3.select("main").append("canvas");
        svg.attr("width", length * 2).attr("height", length * 20);
        svg.on("mousemove", function () { return _this.onMouse(); });
        this.svg = svg;
        this.graphRow(this.currentRow, 0);
        this.statsBox = d3.select("main").append("div");
        this.statsBox.attr("id", "hw3stats");
        return;
    }
    Hw3Controller.prototype.onMouse = function () {
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
    Hw3Controller.prototype.dostuff = function () {
        var next_row = this.nextRow(this.currentRow);
        this.data.push(this.currentRow);
        this.graphRow(next_row, this.data.length);
        this.currentRow = next_row;
        return;
    };
    Hw3Controller.prototype.realMod = function (n, m) {
        // javascript mod doesnt work with negative numbers
        //http://stackoverflow.com/a/17323608
        return ((n % m) + m) % m;
    };
    Hw3Controller.prototype.nextRow = function (row) {
        var rval = Array(row.length);
        for (var i = 0; i < row.length; ++i) {
            var previous = row[this.realMod(i - 1, row.length)];
            var current = row[this.realMod(i, row.length)];
            var next = row[this.realMod(i + 1, row.length)];
            rval[i] = this.poly(previous, current, next);
            if (rval[i] > 1) {
                alert(rval[i]);
            }
            else if (rval[i] < 0) {
                alert(rval[i]);
            }
        }
        return rval;
    };
    // taken from Blair's ALife1Dim Java program
    Hw3Controller.prototype.poly = function (u, x, v) {
        return (0.5 - 0.5 * Math.cos(Math.PI * (this.a + (this.a - this.b) * v + this.b * u * v - 2 * u * x * v)));
    };
    Hw3Controller.prototype.toHexString = function (val) {
        var hexstring = Math.round(val * 0xFFFFFF).toString(16);
        hexstring = (hexstring.length < 6) ? "000000".substr(hexstring.length - 6) + hexstring : hexstring;
        return hexstring;
    };
    Hw3Controller.prototype.graphRow = function (row, yIndex) {
        var total_width = parseInt(this.svg.style("width"));
        var rec_width = total_width / row.length;
        var y_index = yIndex * rec_width;
        var context = this.svg.node().getContext("2d");
        row.forEach(function (d, i) {
            context.beginPath();
            context.rect(i * rec_width, y_index, rec_width, rec_width);
            context.fillStyle = "#" + Hw3Controller.prototype.toHexString(row[i]);
            context.fill();
            //if (row[i] == 0 && context.fillStyle != "#000000") {
            //    var stop = true;
            //}
            //console.log(row[i].toString() + " -> " + context.fillStyle);
            context.closePath();
        });
    };
    Hw3Controller.prototype.getStats = function (data, rowIndex, colIndex, width) {
        var rval = {};
        for (var i = 0; i < rowIndex; ++i) {
            var row = data[i];
            var local_width = Math.min(Math.floor(width), row.length);
            var start_index = colIndex - Math.floor(local_width / 2);
            var value = this.getString(row, start_index, local_width);
            rval[value] = (rval[value] ? rval[value] + 1 : 1);
        }
        return rval;
    };
    Hw3Controller.prototype.getString = function (data, start, length) {
        var rval = "";
        for (var i = start; i < (start + length); ++i) {
            rval += this.toHexString(data[this.realMod(i, data.length)]);
        }
        return rval;
    };
    Hw3Controller.prototype.printStats = function (row, col, width, stats) {
        this.statsBox.selectAll("p").remove();
        var info_p = this.statsBox.append("p");
        var statstr = "row " + row + ", col " + col + " (length " + width + ") with a=" + this.a.toString() + " and b=" + this.b.toString();
        info_p.text(statstr);
        var entropy_p = this.statsBox.append("p");
        var count_p = this.statsBox.append("p");
        count_p.attr("class", "long");
        //count_p.text("count: " + JSON.stringify(stats, null, 2));
        var count_array = [];
        for (var c in stats) {
            count_array.push([c, stats[c]]);
        }
        count_array.sort(function (a, b) {
            return a[1] - b[1];
        });
        count_array.reverse();
        statstr = "count: { ";
        for (var i = 0; i < count_array.length; ++i) {
            statstr += '"' + count_array[i][0].toString() + '": ' + count_array[i][1].toString();
            if (i < count_array.length - 1) {
                statstr += ", ";
            }
        }
        statstr += " }";
        count_p.text(statstr);
        var total_count = 0;
        var weights = {};
        var entropy = 0;
        var valid_strings = Object.keys(stats);
        for (var i = 0; i < valid_strings.length; ++i) {
            var count = stats[valid_strings[i]];
            var weight = count / row;
            weights[valid_strings[i]] = weight;
            entropy += weight * (Math.log(weight) / Math.log(2));
            total_count += count;
        }
        if (total_count != row) {
            this.statsBox.append("p").text("total count != row:  " + total_count.toString() + " != " + row.toString());
            alert("totalcount != row");
        }
        var fract_p = this.statsBox.append("p");
        fract_p.attr("class", "long");
        statstr = "weights: [";
        valid_strings = Object.keys(weights);
        for (var i = 0; i < valid_strings.length; ++i) {
            var weight = weights[valid_strings[i]];
            statstr += weight.toFixed(3);
            if (i < valid_strings.length - 1) {
                statstr += ",";
            }
        }
        statstr += "]";
        //fract_p.text(statstr);
        fract_p.text("weights: " + JSON.stringify(weights, function (key, value) {
            if (key) {
                return value.toFixed(3);
            }
            return value;
        }, 2));
        //info_p.text(info_p.text() + "     ----------     " + "shannon's entropy: " + (0 - entropy));
        //    info_p.
        entropy_p.text("shannon's entropy: " + (0 - entropy));
        return;
    };
    return Hw3Controller;
})(BaseTimer);
//# sourceMappingURL=Hw3Controller.js.map