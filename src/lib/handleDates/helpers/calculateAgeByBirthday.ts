export type BirthDate = Date | null;
export type Age = number | null;

export function calculatePetAge(birthDate: BirthDate): Age {
	if (!birthDate) return null;

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();

	// Adjust age if birthday hasn't occurred yet this year
	if (
		today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() &&
			today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}

export default calculatePetAge;
