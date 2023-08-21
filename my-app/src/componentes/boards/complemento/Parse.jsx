export default  function Parse(data) {
    const parts = data.split('/');
    if (parts.length !== 3) {
        throw new Error('Invalid date format');
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
} 