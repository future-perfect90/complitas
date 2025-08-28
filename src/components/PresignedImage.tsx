import React, { useEffect, useState } from 'react';

interface Props {
	imageName: string;
	uploadApiUrl: string;
	accept?: string;
	directory?: string;
}

const PresignedImage: React.FC<Props> = ({
	imageName,
	uploadApiUrl,
	directory,
}) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		const fetchUrl = async () => {
			const res = await fetch(uploadApiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileName: `${directory}${imageName}`,
				}),
			});

			if (!res.ok) throw new Error('Failed to get presigned URL');

			const { presignedUrl } = await res.json();
			setUrl(presignedUrl);
		};
		console.log('Fetching presigned URL...');
		fetchUrl();
	}, []);

	return (
		<div className="mb-4">
			<img src={url} alt="Company Logo" className="h-24" />
		</div>
	);
};

export default PresignedImage;
