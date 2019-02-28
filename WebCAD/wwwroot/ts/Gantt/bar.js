import date_utils from './date_utils.js';
import { $, createSVG, animateSVG } from './svg_utils.js';
var Bar = (function () {
    function Bar(gantt, task) {
        this.set_defaults(gantt, task);
        this.prepare();
        this.draw();
        this.bind();
    }
    Bar.prototype.set_defaults = function (gantt, task) {
        this.action_completed = false;
        this.gantt = gantt;
        this.task = task;
    };
    Bar.prototype.prepare = function () {
        this.prepare_values();
        this.prepare_helpers();
    };
    Bar.prototype.prepare_values = function () {
        this.invalid = this.task.invalid;
        this.height = this.gantt.options.bar_height;
        this.x = this.compute_x();
        this.y = this.compute_y();
        this.corner_radius = this.gantt.options.bar_corner_radius;
        this.duration =
            date_utils.diff(this.task._end, this.task._start, 'hour') /
                this.gantt.options.step;
        this.width = this.gantt.options.column_width * this.duration;
        this.progress_width =
            this.gantt.options.column_width *
                this.duration *
                (this.task.progress / 100) || 0;
        this.group = createSVG('g', {
            class: 'bar-wrapper ' + (this.task.custom_class || ''),
            'data-id': this.task.id
        });
        this.bar_group = createSVG('g', {
            class: 'bar-group',
            append_to: this.group
        });
        this.handle_group = createSVG('g', {
            class: 'handle-group',
            append_to: this.group
        });
    };
    Bar.prototype.prepare_helpers = function () {
        SVGElement.prototype.getX = function () {
            return +this.getAttribute('x');
        };
        SVGElement.prototype.getY = function () {
            return +this.getAttribute('y');
        };
        SVGElement.prototype.getWidth = function () {
            return +this.getAttribute('width');
        };
        SVGElement.prototype.getHeight = function () {
            return +this.getAttribute('height');
        };
        SVGElement.prototype.getEndX = function () {
            return this.getX() + this.getWidth();
        };
    };
    Bar.prototype.draw = function () {
        this.draw_bar();
        this.draw_progress_bar();
        this.draw_label();
        this.draw_resize_handles();
    };
    Bar.prototype.draw_bar = function () {
        this.$bar = createSVG('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'bar',
            append_to: this.bar_group
        });
        animateSVG(this.$bar, 'width', 0, this.width);
        if (this.invalid) {
            this.$bar.classList.add('bar-invalid');
        }
    };
    Bar.prototype.draw_progress_bar = function () {
        if (this.invalid)
            return;
        this.$bar_progress = createSVG('rect', {
            x: this.x,
            y: this.y,
            width: this.progress_width,
            height: this.height,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'bar-progress',
            append_to: this.bar_group
        });
        animateSVG(this.$bar_progress, 'width', 0, this.progress_width);
    };
    Bar.prototype.draw_label = function () {
        var _this = this;
        createSVG('text', {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            innerHTML: this.task.name,
            class: 'bar-label',
            append_to: this.bar_group
        });
        requestAnimationFrame(function () { return _this.update_label_position(); });
    };
    Bar.prototype.draw_resize_handles = function () {
        if (this.invalid)
            return;
        var bar = this.$bar;
        var handle_width = 8;
        createSVG('rect', {
            x: bar.getX() + bar.getWidth() - 9,
            y: bar.getY() + 1,
            width: handle_width,
            height: this.height - 2,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'handle right',
            append_to: this.handle_group
        });
        createSVG('rect', {
            x: bar.getX() + 1,
            y: bar.getY() + 1,
            width: handle_width,
            height: this.height - 2,
            rx: this.corner_radius,
            ry: this.corner_radius,
            class: 'handle left',
            append_to: this.handle_group
        });
        if (this.task.progress && this.task.progress < 100) {
            this.$handle_progress = createSVG('polygon', {
                points: this.get_progress_polygon_points().join(','),
                class: 'handle progress',
                append_to: this.handle_group
            });
        }
    };
    Bar.prototype.get_progress_polygon_points = function () {
        var bar_progress = this.$bar_progress;
        return [
            bar_progress.getEndX() - 5,
            bar_progress.getY() + bar_progress.getHeight(),
            bar_progress.getEndX() + 5,
            bar_progress.getY() + bar_progress.getHeight(),
            bar_progress.getEndX(),
            bar_progress.getY() + bar_progress.getHeight() - 8.66
        ];
    };
    Bar.prototype.bind = function () {
        if (this.invalid)
            return;
        this.setup_click_event();
    };
    Bar.prototype.setup_click_event = function () {
        var _this = this;
        $.on(this.group, 'focus ' + this.gantt.options.popup_trigger, function (e) {
            if (_this.action_completed) {
                return;
            }
            if (e.type === 'click') {
                _this.gantt.trigger_event('click', [_this.task]);
            }
            _this.gantt.unselect_all();
            _this.group.classList.toggle('active');
            _this.show_popup();
        });
    };
    Bar.prototype.show_popup = function () {
        if (this.gantt.bar_being_dragged)
            return;
        var start_date = date_utils.format(this.task._start, 'MMM D');
        var end_date = date_utils.format(date_utils.add(this.task._end, -1, 'second'), 'MMM D');
        var subtitle = start_date + ' - ' + end_date;
        this.gantt.show_popup({
            target_element: this.$bar,
            title: this.task.name,
            subtitle: subtitle,
            task: this.task
        });
    };
    Bar.prototype.update_bar_position = function (_a) {
        var _this = this;
        var _b = _a.x, x = _b === void 0 ? null : _b, _c = _a.width, width = _c === void 0 ? null : _c;
        var bar = this.$bar;
        if (x) {
            var xs = this.task.dependencies.map(function (dep) {
                return _this.gantt.get_bar(dep).$bar.getX();
            });
            var valid_x = xs.reduce(function (prev, curr) {
                return x >= curr;
            }, x);
            if (!valid_x) {
                width = null;
                return;
            }
            this.update_attr(bar, 'x', x);
        }
        if (width && width >= this.gantt.options.column_width) {
            this.update_attr(bar, 'width', width);
        }
        this.update_label_position();
        this.update_handle_position();
        this.update_progressbar_position();
        this.update_arrow_position();
    };
    Bar.prototype.date_changed = function () {
        var changed = false;
        var _a = this.compute_start_end_date(), new_start_date = _a.new_start_date, new_end_date = _a.new_end_date;
        if (Number(this.task._start) !== Number(new_start_date)) {
            changed = true;
            this.task._start = new_start_date;
        }
        if (Number(this.task._end) !== Number(new_end_date)) {
            changed = true;
            this.task._end = new_end_date;
        }
        if (!changed)
            return;
        this.gantt.trigger_event('date_change', [
            this.task,
            new_start_date,
            date_utils.add(new_end_date, -1, 'second')
        ]);
    };
    Bar.prototype.progress_changed = function () {
        var new_progress = this.compute_progress();
        this.task.progress = new_progress;
        this.gantt.trigger_event('progress_change', [this.task, new_progress]);
    };
    Bar.prototype.set_action_completed = function () {
        var _this = this;
        this.action_completed = true;
        setTimeout(function () { return (_this.action_completed = false); }, 1000);
    };
    Bar.prototype.compute_start_end_date = function () {
        var bar = this.$bar;
        var x_in_units = bar.getX() / this.gantt.options.column_width;
        var new_start_date = date_utils.add(this.gantt.gantt_start, x_in_units * this.gantt.options.step, 'hour');
        var width_in_units = bar.getWidth() / this.gantt.options.column_width;
        var new_end_date = date_utils.add(new_start_date, width_in_units * this.gantt.options.step, 'hour');
        return { new_start_date: new_start_date, new_end_date: new_end_date };
    };
    Bar.prototype.compute_progress = function () {
        var progress = (this.$bar_progress.getWidth() / this.$bar.getWidth() * 100);
        return parseInt(progress, 10);
    };
    Bar.prototype.compute_x = function () {
        var _a = this.gantt.options, step = _a.step, column_width = _a.column_width;
        var task_start = this.task._start;
        var gantt_start = this.gantt.gantt_start;
        var diff = date_utils.diff(task_start, gantt_start, 'hour');
        var x = diff / step * column_width;
        if (this.gantt.view_is('Month')) {
            var diff_1 = date_utils.diff(task_start, gantt_start, 'day');
            x = diff_1 * column_width / 30;
        }
        return x;
    };
    Bar.prototype.compute_y = function () {
        return (this.gantt.options.header_height +
            this.gantt.options.padding +
            this.task._index * (this.height + this.gantt.options.padding));
    };
    Bar.prototype.get_snap_position = function (dx) {
        var odx = dx, rem, position;
        if (this.gantt.view_is('Week')) {
            rem = dx % (this.gantt.options.column_width / 7);
            position =
                odx -
                    rem +
                    (rem < this.gantt.options.column_width / 14
                        ? 0
                        : this.gantt.options.column_width / 7);
        }
        else if (this.gantt.view_is('Month')) {
            rem = dx % (this.gantt.options.column_width / 30);
            position =
                odx -
                    rem +
                    (rem < this.gantt.options.column_width / 60
                        ? 0
                        : this.gantt.options.column_width / 30);
        }
        else {
            rem = dx % this.gantt.options.column_width;
            position =
                odx -
                    rem +
                    (rem < this.gantt.options.column_width / 2
                        ? 0
                        : this.gantt.options.column_width);
        }
        return position;
    };
    Bar.prototype.update_attr = function (element, attr, value) {
        value = +value;
        if (!isNaN(value)) {
            element.setAttribute(attr, value);
        }
        return element;
    };
    Bar.prototype.update_progressbar_position = function () {
        this.$bar_progress.setAttribute('x', this.$bar.getX());
        this.$bar_progress.setAttribute('width', this.$bar.getWidth() * (this.task.progress / 100));
    };
    Bar.prototype.update_label_position = function () {
        var bar = this.$bar, label = this.group.querySelector('.bar-label');
        if (label.getBBox().width > bar.getWidth()) {
            label.classList.add('big');
            label.setAttribute('x', bar.getX() + bar.getWidth() + 5);
        }
        else {
            label.classList.remove('big');
            label.setAttribute('x', bar.getX() + bar.getWidth() / 2);
        }
    };
    Bar.prototype.update_handle_position = function () {
        var bar = this.$bar;
        this.handle_group
            .querySelector('.handle.left')
            .setAttribute('x', bar.getX() + 1);
        this.handle_group
            .querySelector('.handle.right')
            .setAttribute('x', bar.getEndX() - 9);
        var handle = this.group.querySelector('.handle.progress');
        handle &&
            handle.setAttribute('points', this.get_progress_polygon_points());
    };
    Bar.prototype.update_arrow_position = function () {
        this.arrows = this.arrows || [];
        for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
            var arrow = _a[_i];
            arrow.update();
        }
    };
    return Bar;
}());
export default Bar;
function isFunction(functionToCheck) {
    var getType = {};
    return (functionToCheck &&
        getType.toString.call(functionToCheck) === '[object Function]');
}
