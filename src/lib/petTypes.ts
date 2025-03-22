import dogImage from '@/assets/pet_types/dog.png';
import birdImage from '@/assets/pet_types/bird.png';
import horseImage from '@/assets/pet_types/horse.png';

const dogImageData = {
	img: dogImage,
	alt: 'Imagen minimalista de un perro',
};
const birdImageData = {
	img: birdImage,
	alt: 'Imagen minimalista de un ave',
};
const horseImageData = {
	img: horseImage,
	alt: 'Imagen minimalista de un caballo',
};

export const petImagesData = {
	perro: dogImageData,
	ave: birdImageData,
	otro: horseImageData,
};
