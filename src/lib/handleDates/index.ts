export * from './helpers';

/**
 * Example usage
 *
 * const birthDate = new Date(2020, 5, 15); // June 15, 2020
 *
 * const formattedBirthDate = formatDateForDatabase(birthDate); // "2020-06-15"
 * @param date a date object to transform to ISO 8601 format: YYYY-MM-DD
 * @returns A string with the date in ISO 8601 format: YYYY-MM-DD
 */

export const formatDateForDatabase = (date: Date): string => {
	return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};
