import React, { useEffect, useState } from 'react';
import { fetchUrl } from '../utils/api';

interface Props {
	imageName: string;
	uploadApiUrl: string;
	accept?: string;
	directory?: string;
}

const PresignedImage: React.FC<Props> = ({
	imageName,
	uploadApiUrl,
	directory = '',
}) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		const getPresignedUrl = async () => {
			const presignedUrl = await fetchUrl(uploadApiUrl, directory, imageName);
			setUrl(presignedUrl);
		};
		getPresignedUrl();
	}, []);

	return (
		<div className="mb-4">
			<img src={url} alt="Company Logo" className="h-24" />
		</div>
	);
};

export default PresignedImage;
