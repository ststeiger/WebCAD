interface Date
{
    addMilliseconds(h: number): Date;

    addSeconds(h: number): Date;

    addMinutes(h: number): Date;

    addHours(h: number): Date;

    addDays(h: number): Date;

    addMonths(h: number): Date;

    addYears(h: number): Date;

    addInterval(interval: string, units: number): Date;

    getDayOfWeek():number;

    getIsoWeek(): number;

    isLeapYear(): boolean;
    isUtcLeapYear(): boolean;

    asUtc(): Date;
    toUtc(): Date;
}


Date.prototype.addMilliseconds = function (h: number)
{
    let date = new Date(this.valueOf());
    date.setTime(date.getTime() + h);
    return date;
};

Date.prototype.addSeconds = function (h: number)
{
    let date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 1000));
    return date;
};

Date.prototype.addMinutes = function (h: number)
{
    let date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 60 * 1000));
    return date;
};

Date.prototype.addHours = function (h: number)
{
    let date = new Date(this.valueOf());
    date.setTime(date.getTime() + (h * 60 * 60 * 1000));
    return date;
};

Date.prototype.addDays = function (days: number)
{
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.addMonths = function (months: number)
{
    let date = new Date(this.valueOf());
    // check end of month...
    date.setMonth(date.getMonth() + months);

    return date;
};

Date.prototype.addYears = function (years: number)
{
    let date = new Date(this.valueOf());
    // check february...
    date.setFullYear(date.getFullYear() + years);
    return date;
};


Date.prototype.addInterval = function (interval: string, units: number)
{
    switch (interval.toLowerCase())
    {
        case 'year'   :
            return this.addYears(units);
        case 'quarter':
            return this.addMonths(3);
        case 'month'  :
            return this.addMonths(units);
        case 'week'   :
            return this.addDays(7);
        case 'day'    :
            return this.addDays(units);
        case 'hour'   :
            return this.addHours(units);
        case 'minute' :
            return this.addMinutes(units);
        case 'second' :
            return this.addSeconds(units);
        case 'millisecond' :
            return this.addMilliseconds(units);
    }
    
    throw new Error("Unknown interval '" + interval + "'.");
};


// getDay: 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on.
// getDay() ==> [monday, ..., sunday]: (x+ 8 -1) mod 8
Date.prototype.getDayOfWeek = function ()
{
    return ((this.getDay()+7) % 8);
};


// Following code is timezone-independent (UTC dates used) 
// and works according to the https://en.wikipedia.org/wiki/ISO_8601
Date.prototype.getIsoWeek = function () {
    let target = new Date(this.valueOf()),
        dayNumber = (this.getUTCDay() + 6) % 7,
        firstThursday;
    
    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);
    
    if (target.getUTCDay() !== 4) {
        target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    }
    
    return Math.ceil((firstThursday - target.valueOf()) /  (7 * 24 * 3600 * 1000)) + 1;
};


Date.prototype.isLeapYear = function () {
    let year = this.getFullYear();

    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};

Date.prototype.isUtcLeapYear = function () {
    let year = this.getUTCFullYear();

    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};

Date.prototype.asUtc = function () {
    let now_utc = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds());

    return new Date(now_utc.valueOf())
};

Date.prototype.toUtc = function () {
    let now_utc = Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(),
        this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());

    return new Date(now_utc.valueOf())
};






// A year is a leap year if, and only if
// year is dividable by 4
// year is not dividable by 100
// or if the year is dividable by 400
function isLeapYear(year:number):boolean
{
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}



// console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
/*
new Date().getTimezoneOffset()

function pad(number, length) {
    var str = "" + number
    while (str.length < length) {
        str = '0' + str
    }
    return str
}

var offset = new Date().getTimezoneOffset()
offset = ((offset < 0 ? '+' : '-') + // Note the reversed sign!
    pad(parseInt(Math.abs(offset / 60)), 2) +
    pad(Math.abs(offset % 60), 2))
*/


// https://github.com/andyearnshaw/Intl.js/
// https://polyfill.io
