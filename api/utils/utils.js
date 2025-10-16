function showDate({ date }) {
    const formatLocalDate = new Intl.DateTimeFormat({
        day: "2-digit",
        weekday: "short",
        month: "2-digit",
        year: "numeric",
    })
    return formatLocalDate.format(date);
}

module.exports = {
    showDate
};
