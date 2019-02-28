import date_utils from './date_utils.js';
import { $, createSVG } from './svg_utils.js';
import Bar from './bar.js';
import Arrow from './arrow.js';
import Popup from './popup.js';
var Gantt = (function () {
    function Gantt(wrapper, tasks, options) {
        this.setup_wrapper(wrapper);
        this.setup_options(options);
        this.setup_tasks(tasks);
        this.change_view_mode();
        this.bind_events();
    }
    Gantt.prototype.setup_wrapper = function (element) {
        var svg_element, wrapper_element;
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element instanceof HTMLElement) {
            wrapper_element = element;
            svg_element = element.querySelector('svg');
        }
        else if (element instanceof SVGElement) {
            svg_element = element;
        }
        else {
            throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,' +
                " HTML DOM element or SVG DOM element for the 'element' parameter");
        }
        if (!svg_element) {
            this.$svg = createSVG('svg', {
                append_to: wrapper_element,
                class: 'gantt'
            });
        }
        else {
            this.$svg = svg_element;
            this.$svg.classList.add('gantt');
        }
        this.$container = document.createElement('div');
        this.$container.classList.add('gantt-container');
        var parent_element = this.$svg.parentElement;
        parent_element.appendChild(this.$container);
        this.$container.appendChild(this.$svg);
        this.popup_wrapper = document.createElement('div');
        this.popup_wrapper.classList.add('popup-wrapper');
        this.$container.appendChild(this.popup_wrapper);
    };
    Gantt.prototype.setup_options = function (options) {
        var default_options = {
            header_height: 50,
            column_width: 30,
            step: 24,
            view_modes: [
                'Quarter Day',
                'Half Day',
                'Day',
                'Week',
                'Month',
                'Year'
            ],
            bar_height: 20,
            bar_corner_radius: 3,
            arrow_curve: 5,
            padding: 18,
            view_mode: 'Day',
            date_format: 'YYYY-MM-DD',
            popup_trigger: 'click',
            custom_popup_html: null,
            language: 'en'
        };
        this.options = Object.assign({}, default_options, options);
    };
    Gantt.prototype.setup_tasks = function (tasks) {
        this.tasks = tasks.map(function (task, i) {
            task._start = date_utils.parse(task.start);
            task._end = date_utils.parse(task.end);
            if (date_utils.diff(task._end, task._start, 'year') > 10) {
                task.end = null;
            }
            task._index = i;
            if (!task.start && !task.end) {
                var today = date_utils.today();
                task._start = today;
                task._end = date_utils.add(today, 2, 'day');
            }
            if (!task.start && task.end) {
                task._start = date_utils.add(task._end, -2, 'day');
            }
            if (task.start && !task.end) {
                task._end = date_utils.add(task._start, 2, 'day');
            }
            var task_end_values = date_utils.get_date_values(task._end);
            if (task_end_values.slice(3).every(function (d) { return d === 0; })) {
                task._end = date_utils.add(task._end, 24, 'hour');
            }
            if (!task.start || !task.end) {
                task.invalid = true;
            }
            if (typeof task.dependencies === 'string' || !task.dependencies) {
                var deps = [];
                if (task.dependencies) {
                    deps = task.dependencies
                        .split(',')
                        .map(function (d) { return d.trim(); })
                        .filter(function (d) { return d; });
                }
                task.dependencies = deps;
            }
            if (!task.id) {
                task.id = generate_id(task);
            }
            return task;
        });
        this.setup_dependencies();
    };
    Gantt.prototype.setup_dependencies = function () {
        this.dependency_map = {};
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var t = _a[_i];
            for (var _b = 0, _c = t.dependencies; _b < _c.length; _b++) {
                var d = _c[_b];
                this.dependency_map[d] = this.dependency_map[d] || [];
                this.dependency_map[d].push(t.id);
            }
        }
    };
    Gantt.prototype.refresh = function (tasks) {
        this.setup_tasks(tasks);
        this.change_view_mode();
    };
    Gantt.prototype.change_view_mode = function (mode) {
        if (mode === void 0) { mode = this.options.view_mode; }
        this.update_view_scale(mode);
        this.setup_dates();
        this.render();
        this.trigger_event('view_change', [mode]);
    };
    Gantt.prototype.update_view_scale = function (view_mode) {
        this.options.view_mode = view_mode;
        if (view_mode === 'Day') {
            this.options.step = 24;
            this.options.column_width = 38;
        }
        else if (view_mode === 'Half Day') {
            this.options.step = 24 / 2;
            this.options.column_width = 38;
        }
        else if (view_mode === 'Quarter Day') {
            this.options.step = 24 / 4;
            this.options.column_width = 38;
        }
        else if (view_mode === 'Week') {
            this.options.step = 24 * 7;
            this.options.column_width = 140;
        }
        else if (view_mode === 'Month') {
            this.options.step = 24 * 30;
            this.options.column_width = 120;
        }
        else if (view_mode === 'Year') {
            this.options.step = 24 * 365;
            this.options.column_width = 120;
        }
    };
    Gantt.prototype.setup_dates = function () {
        this.setup_gantt_dates();
        this.setup_date_values();
    };
    Gantt.prototype.setup_gantt_dates = function () {
        this.gantt_start = this.gantt_end = null;
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            if (!this.gantt_start || task._start < this.gantt_start) {
                this.gantt_start = task._start;
            }
            if (!this.gantt_end || task._end > this.gantt_end) {
                this.gantt_end = task._end;
            }
        }
        this.gantt_start = date_utils.start_of(this.gantt_start, 'day');
        this.gantt_end = date_utils.start_of(this.gantt_end, 'day');
        if (this.view_is(['Quarter Day', 'Half Day'])) {
            this.gantt_start = date_utils.add(this.gantt_start, -7, 'day');
            this.gantt_end = date_utils.add(this.gantt_end, 7, 'day');
        }
        else if (this.view_is('Month')) {
            this.gantt_start = date_utils.start_of(this.gantt_start, 'year');
            this.gantt_end = date_utils.add(this.gantt_end, 1, 'year');
        }
        else if (this.view_is('Year')) {
            this.gantt_start = date_utils.add(this.gantt_start, -2, 'year');
            this.gantt_end = date_utils.add(this.gantt_end, 2, 'year');
        }
        else {
            this.gantt_start = date_utils.add(this.gantt_start, -1, 'month');
            this.gantt_end = date_utils.add(this.gantt_end, 1, 'month');
        }
    };
    Gantt.prototype.setup_date_values = function () {
        this.dates = [];
        var cur_date = null;
        while (cur_date === null || cur_date < this.gantt_end) {
            if (!cur_date) {
                cur_date = date_utils.clone(this.gantt_start);
            }
            else {
                if (this.view_is('Year')) {
                    cur_date = date_utils.add(cur_date, 1, 'year');
                }
                else if (this.view_is('Month')) {
                    cur_date = date_utils.add(cur_date, 1, 'month');
                }
                else {
                    cur_date = date_utils.add(cur_date, this.options.step, 'hour');
                }
            }
            this.dates.push(cur_date);
        }
    };
    Gantt.prototype.bind_events = function () {
        this.bind_grid_click();
        this.bind_bar_events();
    };
    Gantt.prototype.render = function () {
        this.clear();
        this.setup_layers();
        this.make_grid();
        this.make_dates();
        this.make_bars();
        this.make_arrows();
        this.map_arrows_on_bars();
        this.set_width();
        this.set_scroll_position();
    };
    Gantt.prototype.setup_layers = function () {
        this.layers = {};
        var layers = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            this.layers[layer] = createSVG('g', {
                class: layer,
                append_to: this.$svg
            });
        }
    };
    Gantt.prototype.make_grid = function () {
        this.make_grid_background();
        this.make_grid_rows();
        this.make_grid_header();
        this.make_grid_ticks();
        this.make_grid_highlights();
    };
    Gantt.prototype.make_grid_background = function () {
        var grid_width = this.dates.length * this.options.column_width;
        var grid_height = this.options.header_height +
            this.options.padding +
            (this.options.bar_height + this.options.padding) *
                this.tasks.length;
        createSVG('rect', {
            x: 0,
            y: 0,
            width: grid_width,
            height: grid_height,
            class: 'grid-background',
            append_to: this.layers.grid
        });
        $.attr(this.$svg, {
            height: grid_height + this.options.padding + 100,
            width: '100%'
        });
    };
    Gantt.prototype.make_grid_rows = function () {
        var rows_layer = createSVG('g', { append_to: this.layers.grid });
        var lines_layer = createSVG('g', { append_to: this.layers.grid });
        var row_width = this.dates.length * this.options.column_width;
        var row_height = this.options.bar_height + this.options.padding;
        var row_y = this.options.header_height + this.options.padding / 2;
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            createSVG('rect', {
                x: 0,
                y: row_y,
                width: row_width,
                height: row_height,
                class: 'grid-row',
                append_to: rows_layer
            });
            createSVG('line', {
                x1: 0,
                y1: row_y + row_height,
                x2: row_width,
                y2: row_y + row_height,
                class: 'row-line',
                append_to: lines_layer
            });
            row_y += this.options.bar_height + this.options.padding;
        }
    };
    Gantt.prototype.make_grid_header = function () {
        var header_width = this.dates.length * this.options.column_width;
        var header_height = this.options.header_height + 10;
        createSVG('rect', {
            x: 0,
            y: 0,
            width: header_width,
            height: header_height,
            class: 'grid-header',
            append_to: this.layers.grid
        });
    };
    Gantt.prototype.make_grid_ticks = function () {
        var tick_x = 0;
        var tick_y = this.options.header_height + this.options.padding / 2;
        var tick_height = (this.options.bar_height + this.options.padding) *
            this.tasks.length;
        for (var _i = 0, _a = this.dates; _i < _a.length; _i++) {
            var date = _a[_i];
            var tick_class = 'tick';
            if (this.view_is('Day') && date.getDate() === 1) {
                tick_class += ' thick';
            }
            if (this.view_is('Week') &&
                date.getDate() >= 1 &&
                date.getDate() < 8) {
                tick_class += ' thick';
            }
            if (this.view_is('Month') && (date.getMonth() + 1) % 3 === 0) {
                tick_class += ' thick';
            }
            createSVG('path', {
                d: "M " + tick_x + " " + tick_y + " v " + tick_height,
                class: tick_class,
                append_to: this.layers.grid
            });
            if (this.view_is('Month')) {
                tick_x +=
                    date_utils.get_days_in_month(date) *
                        this.options.column_width /
                        30;
            }
            else {
                tick_x += this.options.column_width;
            }
        }
    };
    Gantt.prototype.make_grid_highlights = function () {
        if (this.view_is('Day')) {
            var x = date_utils.diff(date_utils.today(), this.gantt_start, 'hour') /
                this.options.step *
                this.options.column_width;
            var y = 0;
            var width = this.options.column_width;
            var height = (this.options.bar_height + this.options.padding) *
                this.tasks.length +
                this.options.header_height +
                this.options.padding / 2;
            createSVG('rect', {
                x: x,
                y: y,
                width: width,
                height: height,
                class: 'today-highlight',
                append_to: this.layers.grid
            });
        }
    };
    Gantt.prototype.make_dates = function () {
        for (var _i = 0, _a = this.get_dates_to_draw(); _i < _a.length; _i++) {
            var date = _a[_i];
            createSVG('text', {
                x: date.lower_x,
                y: date.lower_y,
                innerHTML: date.lower_text,
                class: 'lower-text',
                append_to: this.layers.date
            });
            if (date.upper_text) {
                var $upper_text = createSVG('text', {
                    x: date.upper_x,
                    y: date.upper_y,
                    innerHTML: date.upper_text,
                    class: 'upper-text',
                    append_to: this.layers.date
                });
                if ($upper_text.getBBox().x2 > this.layers.grid.getBBox().width) {
                    $upper_text.remove();
                }
            }
        }
    };
    Gantt.prototype.get_dates_to_draw = function () {
        var _this = this;
        var last_date = null;
        var dates = this.dates.map(function (date, i) {
            var d = _this.get_date_info(date, last_date, i);
            last_date = date;
            return d;
        });
        return dates;
    };
    Gantt.prototype.get_date_info = function (date, last_date, i) {
        if (!last_date) {
            last_date = date_utils.add(date, 1, 'year');
        }
        var date_text = {
            'Quarter Day_lower': date_utils.format(date, 'HH', this.options.language),
            'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
            Day_lower: date.getDate() !== last_date.getDate()
                ? date_utils.format(date, 'D', this.options.language)
                : '',
            Week_lower: date.getMonth() !== last_date.getMonth()
                ? date_utils.format(date, 'D MMM', this.options.language)
                : date_utils.format(date, 'D', this.options.language),
            Month_lower: date_utils.format(date, 'MMMM', this.options.language),
            Year_lower: date_utils.format(date, 'YYYY', this.options.language),
            'Quarter Day_upper': date.getDate() !== last_date.getDate()
                ? date_utils.format(date, 'D MMM', this.options.language)
                : '',
            'Half Day_upper': date.getDate() !== last_date.getDate()
                ? date.getMonth() !== last_date.getMonth()
                    ? date_utils.format(date, 'D MMM', this.options.language)
                    : date_utils.format(date, 'D', this.options.language)
                : '',
            Day_upper: date.getMonth() !== last_date.getMonth()
                ? date_utils.format(date, 'MMMM', this.options.language)
                : '',
            Week_upper: date.getMonth() !== last_date.getMonth()
                ? date_utils.format(date, 'MMMM', this.options.language)
                : '',
            Month_upper: date.getFullYear() !== last_date.getFullYear()
                ? date_utils.format(date, 'YYYY', this.options.language)
                : '',
            Year_upper: date.getFullYear() !== last_date.getFullYear()
                ? date_utils.format(date, 'YYYY', this.options.language)
                : ''
        };
        var base_pos = {
            x: i * this.options.column_width,
            lower_y: this.options.header_height,
            upper_y: this.options.header_height - 25
        };
        var x_pos = {
            'Quarter Day_lower': this.options.column_width * 4 / 2,
            'Quarter Day_upper': 0,
            'Half Day_lower': this.options.column_width * 2 / 2,
            'Half Day_upper': 0,
            Day_lower: this.options.column_width / 2,
            Day_upper: this.options.column_width * 30 / 2,
            Week_lower: 0,
            Week_upper: this.options.column_width * 4 / 2,
            Month_lower: this.options.column_width / 2,
            Month_upper: this.options.column_width * 12 / 2,
            Year_lower: this.options.column_width / 2,
            Year_upper: this.options.column_width * 30 / 2
        };
        return {
            upper_text: date_text[this.options.view_mode + "_upper"],
            lower_text: date_text[this.options.view_mode + "_lower"],
            upper_x: base_pos.x + x_pos[this.options.view_mode + "_upper"],
            upper_y: base_pos.upper_y,
            lower_x: base_pos.x + x_pos[this.options.view_mode + "_lower"],
            lower_y: base_pos.lower_y
        };
    };
    Gantt.prototype.make_bars = function () {
        var _this = this;
        this.bars = this.tasks.map(function (task) {
            var bar = new Bar(_this, task);
            _this.layers.bar.appendChild(bar.group);
            return bar;
        });
    };
    Gantt.prototype.make_arrows = function () {
        var _this = this;
        this.arrows = [];
        var _loop_1 = function (task) {
            var arrows = [];
            arrows = task.dependencies
                .map(function (task_id) {
                var dependency = _this.get_task(task_id);
                if (!dependency)
                    return;
                var arrow = new Arrow(_this, _this.bars[dependency._index], _this.bars[task._index]);
                _this.layers.arrow.appendChild(arrow.element);
                return arrow;
            })
                .filter(Boolean);
            this_1.arrows = this_1.arrows.concat(arrows);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            _loop_1(task);
        }
    };
    Gantt.prototype.map_arrows_on_bars = function () {
        var _loop_2 = function (bar) {
            bar.arrows = this_2.arrows.filter(function (arrow) {
                return (arrow.from_task.task.id === bar.task.id ||
                    arrow.to_task.task.id === bar.task.id);
            });
        };
        var this_2 = this;
        for (var _i = 0, _a = this.bars; _i < _a.length; _i++) {
            var bar = _a[_i];
            _loop_2(bar);
        }
    };
    Gantt.prototype.set_width = function () {
        var cur_width = this.$svg.getBoundingClientRect().width;
        var actual_width = this.$svg
            .querySelector('.grid .grid-row')
            .getAttribute('width');
        if (cur_width < actual_width) {
            this.$svg.setAttribute('width', actual_width);
        }
    };
    Gantt.prototype.set_scroll_position = function () {
        var parent_element = this.$svg.parentElement;
        if (!parent_element)
            return;
        var hours_before_first_task = date_utils.diff(this.get_oldest_starting_date(), this.gantt_start, 'hour');
        var scroll_pos = hours_before_first_task /
            this.options.step *
            this.options.column_width -
            this.options.column_width;
        parent_element.scrollLeft = scroll_pos;
    };
    Gantt.prototype.bind_grid_click = function () {
        var _this = this;
        $.on(this.$svg, this.options.popup_trigger, '.grid-row, .grid-header', function () {
            _this.unselect_all();
            _this.hide_popup();
        });
    };
    Gantt.prototype.bind_bar_events = function () {
        var _this = this;
        var is_dragging = false;
        var x_on_start = 0;
        var y_on_start = 0;
        var is_resizing_left = false;
        var is_resizing_right = false;
        var parent_bar_id = null;
        var bars = [];
        this.bar_being_dragged = null;
        function action_in_progress() {
            return is_dragging || is_resizing_left || is_resizing_right;
        }
        $.on(this.$svg, 'mousedown', '.bar-wrapper, .handle', function (e, element) {
            var bar_wrapper = $.closest('.bar-wrapper', element);
            if (element.classList.contains('left')) {
                is_resizing_left = true;
            }
            else if (element.classList.contains('right')) {
                is_resizing_right = true;
            }
            else if (element.classList.contains('bar-wrapper')) {
                is_dragging = true;
            }
            bar_wrapper.classList.add('active');
            x_on_start = e.offsetX;
            y_on_start = e.offsetY;
            parent_bar_id = bar_wrapper.getAttribute('data-id');
            var ids = [
                parent_bar_id
            ].concat(_this.get_all_dependent_tasks(parent_bar_id));
            bars = ids.map(function (id) { return _this.get_bar(id); });
            _this.bar_being_dragged = parent_bar_id;
            bars.forEach(function (bar) {
                var $bar = bar.$bar;
                $bar.ox = $bar.getX();
                $bar.oy = $bar.getY();
                $bar.owidth = $bar.getWidth();
                $bar.finaldx = 0;
            });
        });
        $.on(this.$svg, 'mousemove', function (e) {
            if (!action_in_progress())
                return;
            var dx = e.offsetX - x_on_start;
            var dy = e.offsetY - y_on_start;
            bars.forEach(function (bar) {
                var $bar = bar.$bar;
                $bar.finaldx = _this.get_snap_position(dx);
                if (is_resizing_left) {
                    if (parent_bar_id === bar.task.id) {
                        bar.update_bar_position({
                            x: $bar.ox + $bar.finaldx,
                            width: $bar.owidth - $bar.finaldx
                        });
                    }
                    else {
                        bar.update_bar_position({
                            x: $bar.ox + $bar.finaldx
                        });
                    }
                }
                else if (is_resizing_right) {
                    if (parent_bar_id === bar.task.id) {
                        bar.update_bar_position({
                            width: $bar.owidth + $bar.finaldx
                        });
                    }
                }
                else if (is_dragging) {
                    bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
                }
            });
        });
        document.addEventListener('mouseup', function (e) {
            if (is_dragging || is_resizing_left || is_resizing_right) {
                bars.forEach(function (bar) { return bar.group.classList.remove('active'); });
            }
            is_dragging = false;
            is_resizing_left = false;
            is_resizing_right = false;
        });
        $.on(this.$svg, 'mouseup', function (e) {
            _this.bar_being_dragged = null;
            bars.forEach(function (bar) {
                var $bar = bar.$bar;
                if (!$bar.finaldx)
                    return;
                bar.date_changed();
                bar.set_action_completed();
            });
        });
        this.bind_bar_progress();
    };
    Gantt.prototype.bind_bar_progress = function () {
        var _this = this;
        var x_on_start = 0;
        var y_on_start = 0;
        var is_resizing = null;
        var bar = null;
        var $bar_progress = null;
        var $bar = null;
        $.on(this.$svg, 'mousedown', '.handle.progress', function (e, handle) {
            is_resizing = true;
            x_on_start = e.offsetX;
            y_on_start = e.offsetY;
            var $bar_wrapper = $.closest('.bar-wrapper', handle);
            var id = $bar_wrapper.getAttribute('data-id');
            bar = _this.get_bar(id);
            $bar_progress = bar.$bar_progress;
            $bar = bar.$bar;
            $bar_progress.finaldx = 0;
            $bar_progress.owidth = $bar_progress.getWidth();
            $bar_progress.min_dx = -$bar_progress.getWidth();
            $bar_progress.max_dx = $bar.getWidth() - $bar_progress.getWidth();
        });
        $.on(this.$svg, 'mousemove', function (e) {
            if (!is_resizing)
                return;
            var dx = e.offsetX - x_on_start;
            var dy = e.offsetY - y_on_start;
            if (dx > $bar_progress.max_dx) {
                dx = $bar_progress.max_dx;
            }
            if (dx < $bar_progress.min_dx) {
                dx = $bar_progress.min_dx;
            }
            var $handle = bar.$handle_progress;
            $.attr($bar_progress, 'width', $bar_progress.owidth + dx);
            $.attr($handle, 'points', bar.get_progress_polygon_points());
            $bar_progress.finaldx = dx;
        });
        $.on(this.$svg, 'mouseup', function () {
            is_resizing = false;
            if (!($bar_progress && $bar_progress.finaldx))
                return;
            bar.progress_changed();
            bar.set_action_completed();
        });
    };
    Gantt.prototype.get_all_dependent_tasks = function (task_id) {
        var _this = this;
        var out = [];
        var to_process = [task_id];
        while (to_process.length) {
            var deps = to_process.reduce(function (acc, curr) {
                acc = acc.concat(_this.dependency_map[curr]);
                return acc;
            }, []);
            out = out.concat(deps);
            to_process = deps.filter(function (d) { return !to_process.includes(d); });
        }
        return out.filter(Boolean);
    };
    Gantt.prototype.get_snap_position = function (dx) {
        var odx = dx, rem, position;
        if (this.view_is('Week')) {
            rem = dx % (this.options.column_width / 7);
            position =
                odx -
                    rem +
                    (rem < this.options.column_width / 14
                        ? 0
                        : this.options.column_width / 7);
        }
        else if (this.view_is('Month')) {
            rem = dx % (this.options.column_width / 30);
            position =
                odx -
                    rem +
                    (rem < this.options.column_width / 60
                        ? 0
                        : this.options.column_width / 30);
        }
        else {
            rem = dx % this.options.column_width;
            position =
                odx -
                    rem +
                    (rem < this.options.column_width / 2
                        ? 0
                        : this.options.column_width);
        }
        return position;
    };
    Gantt.prototype.unselect_all = function () {
        Array.prototype.slice.call(this.$svg.querySelectorAll('.bar-wrapper'))
            .forEach(function (el) {
            el.classList.remove('active');
        });
    };
    Gantt.prototype.view_is = function (modes) {
        var _this = this;
        if (typeof modes === 'string') {
            return this.options.view_mode === modes;
        }
        if (Array.isArray(modes)) {
            return modes.some(function (mode) { return _this.options.view_mode === mode; });
        }
        return false;
    };
    Gantt.prototype.get_task = function (id) {
        return this.tasks.find(function (task) {
            return task.id === id;
        });
    };
    Gantt.prototype.get_bar = function (id) {
        return this.bars.find(function (bar) {
            return bar.task.id === id;
        });
    };
    Gantt.prototype.show_popup = function (options) {
        if (!this.popup) {
            this.popup = new Popup(this.popup_wrapper, this.options.custom_popup_html);
        }
        this.popup.show(options);
    };
    Gantt.prototype.hide_popup = function () {
        this.popup && this.popup.hide();
    };
    Gantt.prototype.trigger_event = function (event, args) {
        if (this.options['on_' + event]) {
            this.options['on_' + event].apply(null, args);
        }
    };
    Gantt.prototype.get_oldest_starting_date = function () {
        return this.tasks
            .map(function (task) { return task._start; })
            .reduce(function (prev_date, cur_date) {
            return cur_date <= prev_date ? cur_date : prev_date;
        });
    };
    Gantt.prototype.clear = function () {
        this.$svg.innerHTML = '';
    };
    return Gantt;
}());
export default Gantt;
function generate_id(task) {
    return (task.name +
        '_' +
        Math.random()
            .toString(36)
            .slice(2, 12));
}
