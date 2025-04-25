import { Trash } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { DropzoneOptions, FileWithPath, useDropzone } from "react-dropzone"

interface DragAndDropFormProps {
	onFileUploaded?: (file: File) => void
}

const DragAndDropForm: React.FC<DragAndDropFormProps> = ({
	onFileUploaded,
}) => {
	const [files, setFiles] = useState<FileWithPath[]>([])

	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			const validFiles = acceptedFiles.filter((file) => {
				const isImage = file.type.startsWith("image/")
				const isSizeValid = file.size <= 3 * 1024 * 1024
				return isImage && isSizeValid
			})

			setFiles((prevFiles) => [...prevFiles, ...validFiles])

			if (validFiles.length > 0 && onFileUploaded) {
				const confirmed = window.confirm(
					"Сгенерировать заголовок по изображению?(Beta)"
				)
				if (confirmed) {
					onFileUploaded(validFiles[0])
				}
			}
		},
		[onFileUploaded]
	)

	const handleRemoveFile = (file: FileWithPath) => {
		setFiles((prevFiles) => prevFiles.filter((f) => f !== file))
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: "image/*" as unknown as DropzoneOptions["accept"],
	} as DropzoneOptions)

	return (
		<div className='border border-dashed border-neutral-700 p-4 text-center'>
			<div
				{...getRootProps()}
				className='relative flex items-center justify-center'
			>
				<input {...getInputProps()} />
				{files.length === 0 && !isDragActive && (
					<p className='text-center mt-2'>
						Перетащите файл сюда или
						<span className='text-blue-500 underline ml-1'>выберите</span>
					</p>
				)}
				{isDragActive && files.length === 0 && (
					<p className='text-center mt-2'>Перетащите файл сюда...</p>
				)}
			</div>
			{files ? (
				<ul className='mt-4'>
					{files.map((file) => (
						<li key={file.path} className='flex items-center mb-2'>
							<Image
								src={URL.createObjectURL(file)}
								alt={file.name}
								width={64}
								height={64}
								className='w-16 h-16 object-cover mr-2 rounded-md'
							/>
							<span className='flex-1'>{file.name}</span>
							<button
								type='button'
								onClick={() => handleRemoveFile(file)}
								className='text-red-500 hover:text-red-700'
							>
								<Trash />
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

export default DragAndDropForm
