import React, { useState } from 'react';
import authService from '../utils/authService';
import Label from './Label';

interface FileUploadProps {
	uploadApiUrl: string;
	accept?: string;
	onUploadComplete?: (fileUrl: string, fileName: string) => void;
	directory?: string;
	label?: string;
	onClose?: () => void;
}

export default function FileUpload({
	uploadApiUrl,
	accept = '*/*',
	onUploadComplete,
	directory = '',
	label = 'Select File',
	onClose = () => {},
}: FileUploadProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState('');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setMessage('');
		}
	};

	const handleCancel = () => {
		setUploading(false);
	};

	const handleUpload = async () => {
		if (!file) {
			setMessage('Please select a file first.');
			return;
		}

		setUploading(true);
		setMessage('');
		try {
			const uuid = crypto.randomUUID();
			const savedFile = `${uuid}.${file.name.split('.').pop()}`;
			const jwt =
				authService.getAccessTokenSilently ?
					await authService.getAccessTokenSilently()
				:	'';
			const res = await fetch(uploadApiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwt}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fileName: `${directory}${uuid}.${file.name.split('.').pop()}`,
					fileType: file.type,
					action: 'PutObject',
				}),
			});
			console.log(res);

			if (!res.ok) throw new Error('Failed to get presigned URL');

			const { presignedUrl } = await res.json();

			const upload = await fetch(presignedUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file,
			});

			if (!upload.ok) throw new Error('Failed to upload to S3');

			setMessage('✅ Upload successful!');
			if (onUploadComplete) onUploadComplete(presignedUrl, savedFile);
		} catch (err: any) {
			setMessage(`❌ Upload failed: ${err.message}`);
		}

		setUploading(false);
	};

	return (
		<div className="p-4 border rounded-xl shadow-md border-slate-200">
			<Label label={label} />
			<input
				type="file"
				accept={accept}
				onChange={handleFileChange}
				className="mb-3 block text-slate-400"
			/>
			<button
				onClick={handleUpload}
				disabled={uploading}
				className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
				{uploading ? 'Uploading...' : 'Upload'}
			</button>{' '}
			<button
				onClick={onClose}
				className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">
				{'Cancel'}
			</button>
			{message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
		</div>
	);
}
