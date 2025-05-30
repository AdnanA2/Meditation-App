/**
 * Formats a number of seconds into a MM:SS time string.
 * @param seconds - The number of seconds to format (must be non-negative)
 * @returns A string in the format "MM:SS"
 * @throws {Error} If seconds is negative
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 0) {
    throw new Error('Seconds must be non-negative');
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 