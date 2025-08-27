/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-RANDOM4-TNKRSLTN
 *
 * Example: ORD-20250818-4821-TNKRSLTN
 *
 * @returns {string} Generated order number
 */
function generateOrderNumber() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random

    return `ORD-${formattedDate}-${randomPart}-TNKRSLTN`;
}

module.exports = { generateOrderNumber };