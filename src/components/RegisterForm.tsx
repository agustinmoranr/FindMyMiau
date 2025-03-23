'use client';
import { toast } from 'sonner';
import { useForm, useWatch, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { capitalize, cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from './ui/label';
import CatCompany from './CatCompany';
import { H2 } from './ui/typography/Headings';
import { petImagesData } from '@/lib/petTypes';

import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	ArrowRight,
	CalendarIcon,
	ChevronLeft,
	CloudUpload,
	ImageUp,
	Upload,
} from 'lucide-react';
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from '@/components/ui/file-upload';
import {
	PhoneInput,
	spanishSpeakingCountries,
} from '@/components/ui/phone-input';
// import {
//   DatetimePicker
// } from "@/components/ui/datetime-picker"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { genders, petSpecies, petSpeciesEnum } from '@/drizzle/schema';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import es from 'react-phone-number-input/locale/es';
import { es as DatePickerEsLocale } from 'react-day-picker/locale';
import { useEffect, useState, type PropsWithChildren } from 'react';
import Stepper, { Step, type StepperContextType } from './Stepper';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

const dropZoneConfig = {
	maxFiles: 1,
	maxSize: 1024 * 1024 * 4,
	multiple: false,
};

const formSchema = z.object({
	species: z.enum(petSpecies),
	name: z.string().min(1),
	profile_photo_file: z
		.array(
			z.instanceof(File).refine((file) => file.size < dropZoneConfig.maxSize, {
				message: 'La imagen debe ser menor a 5MB',
			}),
		)
		.max(dropZoneConfig.maxFiles),
	// description: z.string().optional().nullable(),
	// birthday: z.coerce.date().optional(),
	// phone_number: z
	// 	.string()
	// 	.refine((value) => !value || isPossiblePhoneNumber(value), {
	// 		message: 'Número de teléfono inválido',
	// 	}),
	// gender: z.enum(genders).optional(),
	// race: z.string().optional(),
});

function NavigateNextStep({
	children,
	control,
	stepperApi,
	...props
}: {
	control: Control<z.infer<typeof formSchema>>;
	stepperApi: StepperContextType | null;
} & ButtonProps &
	PropsWithChildren) {
	const petName = useWatch({
		control,
		name: 'name', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
		defaultValue: '', // default value before the render
	});

	return (
		<Button
			{...props}
			disabled={!petName}
			onClick={() => stepperApi?.goNextStep()}>
			<span>{children}</span>
			<span>
				<ArrowRight />
			</span>
		</Button>
	);
}

export default function CreatePetProfileForm() {
	const [stepperApi, setStepperApi] = useState<StepperContextType | null>(null);
	const [currentStep, setCurrentStep] = useState(
		() => stepperApi?.getCurrentStep() ?? 0,
	);
	const [isPetNameSet, setIsPetNameSet] = useState(false);

	useEffect(() => {
		if (!stepperApi) return;

		//sync state
		const unsubscribe = stepperApi.on('stepChange', (step) =>
			setCurrentStep(step),
		);

		return unsubscribe;
	}, [stepperApi]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			// description: null,
			// birthday: new Date(),
			// race: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);

			toast(
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(values, null, 2)}</code>
				</pre>,
			);
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to submit the form. Please try again.');
		}
	}

	const selectedPetType = form.getValues('species');
	const petName = form.getValues('name');
	// const petName = form.watch('name');

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn('py-2 mt-4 space-y-8', { 'mt-8': currentStep === 0 })}>
				{selectedPetType && (
					<div className='flex items-center'>
						{selectedPetType === 'gato' ? (
							<Button
								type='button'
								onClick={() => {
									if (currentStep !== 0) {
										stepperApi?.goToStep(0);
									}
								}}
								className={cn(
									'size-9 rounded-full !p-1.5 bg-secondary ring ring-secondary/75',
									{
										'bg-accent': currentStep === 0,
									},
								)}>
								<CatCompany
									width={24}
									height={24}
									fill={currentStep === 0 ? '#000' : '#fff'}
									className='size-full'
								/>
							</Button>
						) : (
							<Button
								type='button'
								onClick={() => {
									if (currentStep !== 0) {
										stepperApi?.goToStep(0);
									}
								}}
								className={cn(
									'size-9 rounded-full !p-1.5 bg-secondary ring ring-secondary/75',
									{
										'bg-accent': currentStep === 0,
									},
								)}>
								<img
									src={petImagesData[selectedPetType].img.src}
									width={petImagesData[selectedPetType].img.width}
									height={petImagesData[selectedPetType].img.height}
									alt={petImagesData[selectedPetType].alt}
									className={cn('invert-100 w-full', {
										'invert-0': currentStep === 0,
									})}
								/>
							</Button>
						)}
						<div className='w-4 h-[1px] bg-muted-foreground' />
						{selectedPetType && (
							<Button
								type='button'
								size='sm'
								onClick={() => {
									if (currentStep !== 1) {
										stepperApi?.goToStep(1);
									}
								}}
								className={cn('text-sm bg-secondary ring ring-secondary/75', {
									'bg-accent text-accent-foreground font-medium':
										currentStep === 1,
								})}>
								{petName ? petName : '¿Nombre?'}
							</Button>
						)}
						{petName && (
							<>
								<div className='w-4 h-[1px] bg-muted-foreground' />

								<Button
									type='button'
									size='sm'
									onClick={() => {
										if (currentStep !== 2) {
											stepperApi?.goToStep(2);
										}
									}}
									className={cn(
										'size-9 rounded-full !p-1.5 bg-secondary ring ring-secondary/75',
										{
											'bg-accent text-accent-foreground font-medium':
												currentStep === 2,
										},
									)}>
									<ImageUp
										className={cn('size-full text-foreground', {
											'text-background': currentStep === 2,
										})}
									/>
								</Button>
							</>
						)}
					</div>
				)}
				<Stepper setStepperApi={setStepperApi}>
					<Step>
						{/* implementing pet type selection as radio group customized */}
						<FormField
							control={form.control}
							name='species'
							render={({ field, formState, fieldState }) => {
								return (
									<FormItem>
										<FormLabel className='block scroll-m-20 pb-2 text-4xl sm:text-5xl font-bold tracking-tighter first:mt-0 balooFont text-balance'>
											FindMy<span className='text-primary'>Miau</span> no es
											exclusivo de gatos
										</FormLabel>
										<FormDescription className='[font-size:inherit]'>
											Selecciona tu tipo de mascota
										</FormDescription>
										<FormControl>
											<RadioGroup
												value={field.value}
												onValueChange={(e) => {
													field.onChange(e);
													stepperApi?.goNextStep();
												}}
												className='grid grid-cols-2 xl:grid-cols-4 gap-2.5 mt-8'>
												{petSpecies.map((option, index) => {
													const illustration =
														option === 'gato' ? (
															<CatCompany width='100%' fill='#fff' />
														) : (
															<img
																src={petImagesData[option].img.src}
																width={petImagesData[option].img.width}
																height={petImagesData[option].img.height}
																alt={petImagesData[option].alt}
																className='invert-100'
															/>
														);
													return (
														<div key={option}>
															<RadioGroupItem
																value={option}
																id={option}
																className='sr-only peer'
															/>
															<Label
																htmlFor={option}
																onClick={(e) => {
																	console.log({ formState, fieldState });
																	// field.onChange(e);
																	form.setValue('species', option);
																	stepperApi?.goNextStep();
																}}
																className='bg-secondary/50 backdrop-blur-sm border-primary/30 text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm peer-has-data-[state=checked]:bg-primary/75  peer-focus-visible:border-accent peer-focus-visible:ring-accent focus-visible:ring-[3px]
                               [font-size:inherit] hover:peer-data-[state=unchecked]:scale-[97%] hover:peer-data-[state=unchecked]:bg-secondary/75 ease-[ease] duration-200'>
																<div className='flex flex-col justify-between gap-6'>
																	{illustration}
																	<span className='leading-none font-normal text-center'>
																		{capitalize(option)}
																	</span>
																</div>
															</Label>
														</div>
													);
												})}
											</RadioGroup>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</Step>
					<Step>
						<FormField
							control={form.control}
							name='name'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className='block scroll-m-20 pb-2 text-4xl sm:text-5xl font-bold tracking-tighter first:mt-0 balooFont text-balance'>
										¿Cual es el nombre de tu{' '}
										<span className='text-primary'>
											{capitalize(form.getValues('species') ?? '')}
										</span>
										?
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Garfield'
											value={field.value || ''}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</Step>
					<Step>
						<FormField
							control={form.control}
							name='profile_photo_file'
							render={({ field, fieldState, formState }) => {
								const hasProfileImage = field.value?.length > 0;
								let profileImageSrc: string | null = null;

								if (hasProfileImage) {
									profileImageSrc = URL.createObjectURL(field.value[0]);
								}

								return (
									<FormItem>
										<FormLabel className='block scroll-m-20 pb-2 text-4xl sm:text-5xl font-bold tracking-tighter first:mt-0 balooFont text-balance'>
											Añade una imagen de perfil para{' '}
											<span className='text-primary'>
												{capitalize(petName)}
											</span>
										</FormLabel>
										<FormDescription className='[font-size:inherit] mb-6'>
											También puedes hacerlo más adelante
										</FormDescription>
										<FormControl>
											<FileUploader
												value={field.value}
												onValueChange={field.onChange}
												dropzoneOptions={dropZoneConfig}
												reSelect
												className='relative bg-background rounded-lg p-2'>
												<div
													className={cn(
														'outline-dashed outline-2 outline-primary size-full max-w-[450px] mx-auto rounded-full aspect-square  bg-primary/30 overflow-hidden',

														{
															'outline-solid  outline-4': hasProfileImage,
														},
													)}>
													{!hasProfileImage && (
														<FileInput
															id='fileInput'
															className={cn(
																'flex items-center justify-center aspect-square',
															)}>
															<ImageUp className='size-20 text-foreground' />
														</FileInput>
													)}
													{profileImageSrc && (
														<FileUploaderContent className='size-full'>
															<FileUploaderItem
																index={0}
																aria-roledescription={`file ${1} containing ${
																	field.value[0].name
																}`}
																className='size-full'
																removeButtonClassName='w-fit h-fit bottom-8 top-[initial] left-1/2  -translate-x-1/2 bg-background/30 p-2 rounded-full'
																removeIconClassName='size-12'>
																<img
																	src={profileImageSrc}
																	alt={field.value[0].name}
																	className='object-cover rounded-md size-full'
																/>
															</FileUploaderItem>
														</FileUploaderContent>
													)}
												</div>
											</FileUploader>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</Step>
				</Stepper>
				{currentStep > 0 && (
					<nav className='flex items-center justify-between gap-2'>
						<Button
							type='button'
							size='sm'
							variant='secondary'
							className='text-foreground basis-1/2 shrink'
							onClick={() => stepperApi?.goPreviousStep()}>
							<span>
								{/* <ChevronLeft /> */}
								<ArrowLeft />
							</span>
							<span>Regresar</span>
						</Button>

						<NavigateNextStep
							control={form.control}
							stepperApi={stepperApi}
							type='button'
							size='sm'
							className='basis-1/2 shrink'>
							Continuar
						</NavigateNextStep>
					</nav>
				)}

				{/* <Button type='submit'>Crear Perfil 🎉</Button> */}

				{/* campo de nombre de mascota */}

				{/* <FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descripción</FormLabel>
							<FormControl>
								<Input
									value={field.value || ''}
									onChange={field.onChange}
									placeholder='Garfield es gato con una mancha blanca en su cola...'
								/>
							</FormControl>
							<FormDescription>
								Añade una breve descripción de tu mascota
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>  */}

				{/* <FormField
					control={form.control}
					name='age'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Edad</FormLabel>
							<FormControl>
								<Input placeholder='3' type='number' {...field} />
							</FormControl>
							<FormDescription>¿Cuántos años tiene tu mascota?</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* <FormField
					control={form.control}
					name='species'
					render={({ field, fieldState, formState }, ...args) => {
						return (
							<FormItem>
								<FormLabel>Tipo de Mascota</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Gato' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{petSpecies.map((specie) => {
											// Helper function to capitalize first letter safely
											return (
												<SelectItem key={specie} value={specie}>
													{capitalize(specie)}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<FormDescription>
									FindMyMiau no es exclusivo de gatos
								</FormDescription>
								<FormMessage />
							</FormItem>
						);
					}}
				/> */}

				{/* <FormField
					control={form.control}
					name='profile_photo_file'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Imagen de Perfil</FormLabel>
							<FormControl>
								<FileUploader
									value={field.value}
									onValueChange={field.onChange}
									dropzoneOptions={dropZoneConfig}
									className='relative bg-background rounded-lg p-2'>
									<FileInput
										id='fileInput'
										className='outline-dashed outline-1 outline-slate-500'>
										<div className='flex items-center justify-center flex-col p-8 w-full '>
											<CloudUpload className='text-gray-500 w-10 h-10' />
											<p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
												<span className='font-semibold'>
													Haz click para cargar una imagen
												</span>
												&nbsp; o arrástrala y suéltala
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												JPG, JPEG o PNG
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{field.value?.map((file, i) => {
											// const srcImage = URL.createObjectURL(file);
											return (
												<FileUploaderItem
													key={i}
													index={i}
													aria-roledescription={`file ${i + 1} containing ${
														file.name
													}`}
													className='p-0 size-20'>
													<AspectRatio className='size-full'>
														<Image
															src={srcImage}
															alt={file.name}
															width={400}
															height={400}
															className='object-cover rounded-md'
														/>
														<span className='block'>
															Aquí se mostrar el preview de la imagen
														</span>
													</AspectRatio>
												</FileUploaderItem>
											);
										})}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>
							<FormDescription>Imagen de tu mascota</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* <FormField
					control={form.control}
					name='phone_number'
					render={({ field }) => (
						<FormItem className='flex flex-col items-start'>
							<FormLabel>Número de Contacto</FormLabel>
							<FormControl className='w-full'>
								<PhoneInput
									countries={spanishSpeakingCountries}
									placeholder='5543785943'
									international
									defaultCountry='MX'
									countrySelectProps={{
										unicodeFlags: true,
									}}
									labels={es}
									value={field.value || ''} // Ensure value is never undefined
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>Introduce un número de contacto</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* <FormField
					control={form.control}
					name='gender'
					render={({ field }) => (
						<FormItem className='space-y-3'>
							<FormLabel>Sexo</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									className='flex flex-col space-y-1'>
									{genders.map((option, index) => (
										<FormItem
											className='flex items-center space-x-3 space-y-0'
											key={index}>
											<FormControl>
												<RadioGroupItem value={option} />
											</FormControl>
											<FormLabel className='font-normal'>
												{capitalize(option)}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormDescription>
								Selecciona el sexo de tu mascota
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* <FormField
					control={form.control}
					name='race'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Raza</FormLabel>
							<FormControl>
								<Input
									placeholder='Siamés'
									type='text'
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>¿Cuál es la raza de tu mascota?</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				{/* <FormField
					control={form.control}
					name='birthday'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Nacimiento</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn(
												'w-[240px] pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground',
											)}>
											{field.value ? (
												format(field.value, 'PPP', {
													locale: DatePickerEsLocale,
												})
											) : (
												<span>Selecciona una Fecha</span>
											)}
											<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										autoFocus
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Añade la fecha de nacimiento de tu mascota
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}
			</form>
		</Form>
	);
}
