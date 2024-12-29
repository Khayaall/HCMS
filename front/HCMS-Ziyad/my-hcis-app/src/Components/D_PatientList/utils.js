/**
 * Formats a date object to a string in the format YYYY-MM-DD.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };