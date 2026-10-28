/**
 * Reusable Indian Rupee (INR ₹) Currency Formatter
 * 
 * Formats numbers into Indian currency representation according to en-IN locale.
 * Examples:
 *   formatCurrency(150)  -> "₹150"
 *   formatCurrency(250)  -> "₹250"
 *   formatCurrency(450)  -> "₹450"
 *   formatCurrency(1200) -> "₹1,200"
 *
 * @param {number|string} amount - Numeric or string value to format
 * @param {object} customOptions - Optional Intl.NumberFormat overrides
 * @returns {string} Formatted INR currency string
 */
export const formatCurrency = (amount, customOptions = {}) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...customOptions,
  }).format(numericAmount);
};

export default formatCurrency;
