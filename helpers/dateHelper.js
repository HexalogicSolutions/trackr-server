const DateHelper = {
    DateFormat(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].toString();
    },

    getCurrentDateTime() {
        var date = new Date();
        const off = date.getTimezoneOffset()
        const absoff = Math.abs(off)
        return (new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 23) +
            (off > 0 ? '-' : '+') +
            Math.floor(absoff / 60).toFixed(0).padStart(2, '0') + ':' +
            (absoff % 60).toString().padStart(2, '0'))


        //return new Date().toISOString();
    },

    getCurrentDateTimeYYYYMMDD() {
        return this.getCurrentDateTime().slice(0, 10);
    },


}
module.exports = DateHelper;