Date.prototype.addMilliseconds = function (h) {
    var date = new Date(this.valueOf());
    date.setTime(date.getTime() + h);
    return date;
};
Date.prototype.addSeconds = function (h) {
    var date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 1000));
    return date;
};
Date.prototype.addMinutes = function (h) {
    var date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 60 * 1000));
    return date;
};
Date.prototype.addHours = function (h) {
    var date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 60 * 60 * 1000));
    return date;
};
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
Date.prototype.addMonths = function (months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
};
Date.prototype.addYears = function (years) {
    var date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + years);
    return date;
};
Date.prototype.addInterval = function (interval, units) {
    switch (interval.toLowerCase()) {
        case 'year':
            return this.addYears(units);
        case 'quarter':
            return this.addMonths(3);
        case 'month':
            return this.addMonths(units);
        case 'week':
            return this.addDays(7);
        case 'day':
            return this.addDays(units);
        case 'hour':
            return this.addHours(units);
        case 'minute':
            return this.addMinutes(units);
        case 'second':
            return this.addSeconds(units);
        case 'millisecond':
            return this.addMilliseconds(units);
    }
    throw new Error("Unknown interval '" + interval + "'.");
};
Date.prototype.getDayOfWeek = function () {
    return ((this.getDay() + 7) % 8);
};
Date.prototype.getIsoWeek = function () {
    var target = new Date(this.valueOf()), dayNumber = (this.getUTCDay() + 6) % 7, firstThursday;
    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);
    if (target.getUTCDay() !== 4) {
        target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    }
    return Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000)) + 1;
};
Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};
Date.prototype.isUtcLeapYear = function () {
    var year = this.getUTCFullYear();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};
Date.prototype.asUtc = function () {
    var now_utc = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    return new Date(now_utc.valueOf());
};
Date.prototype.toUtc = function () {
    var now_utc = Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
    return new Date(now_utc.valueOf());
};
function isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
