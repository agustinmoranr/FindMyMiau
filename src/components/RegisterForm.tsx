'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { capitalize, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, CloudUpload } from 'lucide-react';
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
import { RadioGroup } from '@/components/ui/radio-group';
// import {
//   DatetimePicker
// } from "@/components/ui/datetime-picker"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { RadioGroupItem } from './ui/radio-group';
import { genders, petSpecies, petSpeciesEnum } from '@/drizzle/schema';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import es from 'react-phone-number-input/locale/es';
import { es as DatePickerEsLocale } from 'react-day-picker/locale';
import { AspectRatio } from './ui/aspect-ratio';

const formSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional().nullable(),
	birthday: z.coerce.date().optional(),
	species: z.enum(petSpecies).default('gato'),
	profile_photo_file: z
		.array(
			z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
				message: 'La imagen debe ser menor a 4MB',
			}),
		)
		.max(1, {
			message: 'Puedes añadir un máximo de 5 fotos',
		}),
	phone_number: z
		.string()
		.refine((value) => !value || isPossiblePhoneNumber(value), {
			message: 'Número de teléfono inválido',
		}),
	gender: z.enum(genders).optional(),
	race: z.string().optional(),
});

export default function RegisterForm() {
	const dropZoneConfig = {
		maxFiles: 1,
		maxSize: 1024 * 1024 * 4,
		multiple: false,
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: null,
			birthday: new Date(),
			species: 'gato',
			race: '',
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

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 max-w-3xl mx-auto py-10'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre</FormLabel>
							<FormControl>
								<Input
									placeholder='Garfield'
									value={field.value || ''}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>Nombre de tu Miau</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
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
				/>

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

				<FormField
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
				/>

				<FormField
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
														{/* <Image
															src={srcImage}
															alt={file.name}
															width={400}
															height={400}
															className='object-cover rounded-md'
														/> */}
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
				/>

				<FormField
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
				/>

				<FormField
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
				/>

				<FormField
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
				/>

				{/* <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Nacimiento</FormLabel>
          <DatetimePicker
            {...field}
            format={[
              ["months", "days", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
          />
       <FormDescription>Añade la fecha de nacimiento de tu mascota</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    /> */}
				<FormField
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
				/>
				<Button type='submit'>Crear Perfil 🎉</Button>
			</form>
		</Form>
	);
}
