function showDate({ date }) {
    const options = {
        year: "numeric",
        month: "2-digit",
        weekday: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };

    return new Intl.DateTimeFormat("es-Mx", options).format(date);
}

module.exports = {
    showDate
};
