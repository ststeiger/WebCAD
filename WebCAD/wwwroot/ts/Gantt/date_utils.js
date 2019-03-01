var YEAR = 'year';
var MONTH = 'month';
var DAY = 'day';
var HOUR = 'hour';
var MINUTE = 'minute';
var SECOND = 'second';
var MILLISECOND = 'millisecond';
var month_names = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    ru: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ],
    ptBr: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ]
};
export default {
    parse: function (date, date_separator, time_separator) {
        if (date_separator === void 0) { date_separator = '-'; }
        if (time_separator === void 0) { time_separator = /[.:]/; }
        if (date instanceof Date) {
            return date;
        }
        if (typeof date === 'string') {
            var date_parts = void 0, time_parts = void 0;
            var parts = date.split(' ');
            date_parts = parts[0]
                .split(date_separator)
                .map(function (val) { return parseInt(val, 10); });
            time_parts = parts[1] && parts[1].split(time_separator);
            date_parts[1] = date_parts[1] - 1;
            var vals = date_parts;
            if (time_parts && time_parts.length) {
                if (time_parts.length == 4) {
                    time_parts[3] = '0.' + time_parts[3];
                    time_parts[3] = parseFloat(time_parts[3]) * 1000;
                }
                vals = vals.concat(time_parts);
            }
            return new (Date.bind.apply(Date, [void 0].concat(vals)))();
        }
    },
    to_string: function (date, with_time) {
        if (with_time === void 0) { with_time = false; }
        if (!(date instanceof Date)) {
            throw new TypeError('Invalid argument type');
        }
        var vals = this.get_date_values(date).map(function (val, i) {
            if (i === 1) {
                val = val + 1;
            }
            if (i === 6) {
                return padStart(val + '', 3, '0');
            }
            return padStart(val + '', 2, '0');
        });
        var date_string = vals[0] + "-" + vals[1] + "-" + vals[2];
        var time_string = vals[3] + ":" + vals[4] + ":" + vals[5] + "." + vals[6];
        return date_string + (with_time ? ' ' + time_string : '');
    },
    format: function (date, format_string, lang) {
        if (format_string === void 0) { format_string = 'YYYY-MM-DD HH:mm:ss.SSS'; }
        if (lang === void 0) { lang = 'en'; }
        var values = this.get_date_values(date).map(function (d) { return padStart(d, 2, '0'); });
        var format_map = {
            YYYY: values[0],
            MM: padStart((+values[1] + 1).toString(), 2, '0'),
            DD: values[2],
            HH: values[3],
            mm: values[4],
            ss: values[5],
            SSS: values[6],
            D: values[2],
            MMMM: month_names[lang][+values[1]],
            MMM: month_names[lang][+values[1]]
        };
        var str = format_string;
        var formatted_values = [];
        Object.keys(format_map)
            .sort(function (a, b) { return b.length - a.length; })
            .forEach(function (key) {
            if (str.includes(key)) {
                str = str.replace(key, "$" + formatted_values.length);
                formatted_values.push(format_map[key]);
            }
        });
        formatted_values.forEach(function (value, i) {
            str = str.replace("$" + i, value);
        });
        return str;
    },
    diff: function (date_a, date_b, scale) {
        if (scale === void 0) { scale = DAY; }
        var milliseconds, seconds, hours, minutes, days, months, years;
        milliseconds = date_a.getTime() - date_b.getTime();
        seconds = milliseconds / 1000;
        minutes = seconds / 60;
        hours = minutes / 60;
        days = hours / 24;
        months = days / 30;
        years = months / 12;
        if (!scale.endsWith('s')) {
            scale += 's';
        }
        return Math.floor({
            milliseconds: milliseconds,
            seconds: seconds,
            minutes: minutes,
            hours: hours,
            days: days,
            months: months,
            years: years
        }[scale]);
    },
    today: function () {
        var vals = this.get_date_values(new Date()).slice(0, 3);
        return new (Date.bind.apply(Date, [void 0].concat(vals)))();
    },
    now: function () {
        return new Date();
    },
    add: function (date, quantity, scale) {
        var qty = parseInt(quantity, 10);
        var vals = [
            date.getFullYear() + (scale === YEAR ? qty : 0),
            date.getMonth() + (scale === MONTH ? qty : 0),
            date.getDate() + (scale === DAY ? qty : 0),
            date.getHours() + (scale === HOUR ? qty : 0),
            date.getMinutes() + (scale === MINUTE ? qty : 0),
            date.getSeconds() + (scale === SECOND ? qty : 0),
            date.getMilliseconds() + (scale === MILLISECOND ? qty : 0)
        ];
        return new (Date.bind.apply(Date, [void 0].concat(vals)))();
    },
    start_of: function (date, scale) {
        var _a;
        var scores = (_a = {},
            _a[YEAR] = 6,
            _a[MONTH] = 5,
            _a[DAY] = 4,
            _a[HOUR] = 3,
            _a[MINUTE] = 2,
            _a[SECOND] = 1,
            _a[MILLISECOND] = 0,
            _a);
        function should_reset(_scale) {
            var max_score = scores[scale];
            return scores[_scale] <= max_score;
        }
        var vals = [
            date.getFullYear(),
            should_reset(YEAR) ? 0 : date.getMonth(),
            should_reset(MONTH) ? 1 : date.getDate(),
            should_reset(DAY) ? 0 : date.getHours(),
            should_reset(HOUR) ? 0 : date.getMinutes(),
            should_reset(MINUTE) ? 0 : date.getSeconds(),
            should_reset(SECOND) ? 0 : date.getMilliseconds()
        ];
        return new (Date.bind.apply(Date, [void 0].concat(vals)))();
    },
    clone: function (date) {
        return new (Date.bind.apply(Date, [void 0].concat(this.get_date_values(date))))();
    },
    get_date_values: function (date) {
        return [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];
    },
    get_days_in_month: function (date) {
        var no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var month = date.getMonth();
        if (month !== 1) {
            return no_of_days[month];
        }
        var year = date.getFullYear();
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return 29;
        }
        return 28;
    }
};
function padStart(str, targetLength, padString) {
    str = str + '';
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length > targetLength) {
        return String(str);
    }
    else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length);
        }
        return padString.slice(0, targetLength) + String(str);
    }
}
