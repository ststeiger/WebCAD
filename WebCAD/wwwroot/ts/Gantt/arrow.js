import { createSVG } from './svg_utils.js';
var Arrow = (function () {
    function Arrow(gantt, from_task, to_task) {
        this.gantt = gantt;
        this.from_task = from_task;
        this.to_task = to_task;
        this.calculate_path();
        this.draw();
    }
    Arrow.prototype.calculate_path = function () {
        var _this = this;
        var start_x = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
        var condition = function () {
            return _this.to_task.$bar.getX() < start_x + _this.gantt.options.padding &&
                start_x > _this.from_task.$bar.getX() + _this.gantt.options.padding;
        };
        while (condition()) {
            start_x -= 10;
        }
        var start_y = this.gantt.options.header_height +
            this.gantt.options.bar_height +
            (this.gantt.options.padding + this.gantt.options.bar_height) *
                this.from_task.task._index +
            this.gantt.options.padding;
        var end_x = this.to_task.$bar.getX() - this.gantt.options.padding / 2;
        var end_y = this.gantt.options.header_height +
            this.gantt.options.bar_height / 2 +
            (this.gantt.options.padding + this.gantt.options.bar_height) *
                this.to_task.task._index +
            this.gantt.options.padding;
        var from_is_below_to = this.from_task.task._index > this.to_task.task._index;
        var curve = this.gantt.options.arrow_curve;
        var clockwise = from_is_below_to ? 1 : 0;
        var curve_y = from_is_below_to ? -curve : curve;
        var offset = from_is_below_to
            ? end_y + this.gantt.options.arrow_curve
            : end_y - this.gantt.options.arrow_curve;
        this.path = "\n            M " + start_x + " " + start_y + "\n            V " + offset + "\n            a " + curve + " " + curve + " 0 0 " + clockwise + " " + curve + " " + curve_y + "\n            L " + end_x + " " + end_y + "\n            m -5 -5\n            l 5 5\n            l -5 5";
        if (this.to_task.$bar.getX() <
            this.from_task.$bar.getX() + this.gantt.options.padding) {
            var down_1 = this.gantt.options.padding / 2 - curve;
            var down_2 = this.to_task.$bar.getY() +
                this.to_task.$bar.getHeight() / 2 -
                curve_y;
            var left = this.to_task.$bar.getX() - this.gantt.options.padding;
            this.path = "\n                M " + start_x + " " + start_y + "\n                v " + down_1 + "\n                a " + curve + " " + curve + " 0 0 1 -" + curve + " " + curve + "\n                H " + left + "\n                a " + curve + " " + curve + " 0 0 " + clockwise + " -" + curve + " " + curve_y + "\n                V " + down_2 + "\n                a " + curve + " " + curve + " 0 0 " + clockwise + " " + curve + " " + curve_y + "\n                L " + end_x + " " + end_y + "\n                m -5 -5\n                l 5 5\n                l -5 5";
        }
    };
    Arrow.prototype.draw = function () {
        this.element = createSVG('path', {
            d: this.path,
            'data-from': this.from_task.task.id,
            'data-to': this.to_task.task.id
        });
    };
    Arrow.prototype.update = function () {
        this.calculate_path();
        this.element.setAttribute('d', this.path);
    };
    return Arrow;
}());
export default Arrow;
