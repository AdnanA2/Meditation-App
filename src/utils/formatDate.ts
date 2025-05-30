/**
 * Formats a date string into a localized date string.
 * @param dateString - The date string to format (ISO format recommended)
 * @param options - Optional formatting options
 * @returns A formatted date string
 * @throws {Error} If dateString is invalid
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }
  
  return date.toLocaleDateString('en-US', options);
}; 