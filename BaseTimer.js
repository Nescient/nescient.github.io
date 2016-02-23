// Copyright © Sam Savage 2016
/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
var BaseTimer = (function () {
    function BaseTimer(elementId) {
        this.timeId = elementId;
        this.timerTimeout = 10;
        this.updateTime();
        return;
    }
    BaseTimer.prototype.updateTime = function () {
        $("#" + this.timeId).text(new Date().toUTCString());
        return;
    };
    BaseTimer.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.onTimerElapse(); }, this.timerTimeout);
        return;
    };
    BaseTimer.prototype.stop = function () {
        clearInterval(this.timerToken);
        return;
    };
    BaseTimer.prototype.onTimerElapse = function () {
        this.updateTime();
        this.dostuff();
        return;
    };
    return BaseTimer;
})();
//# sourceMappingURL=BaseTimer.js.map