import React, { useEffect, useState } from 'react';
import authService from '../utils/authService';

interface Props {
	fileName: string;
	uploadApiUrl: string;
	accept?: string;
	directory?: string;
	linkTextPrefix: string;
}

const PresignedDocument: React.FC<Props> = ({
	fileName,
	uploadApiUrl,
	directory,
	linkTextPrefix,
}) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		const fetchUrl = async () => {
			const jwt =
				authService.getAccessTokenSilently ?
					await authService.getAccessTokenSilently()
				:	'';
			const res = await fetch(uploadApiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({
					fileName: `${directory}${fileName}`,
				}),
			});

			if (!res.ok) throw new Error('Failed to get presigned URL');

			const { presignedUrl } = await res.json();
			setUrl(presignedUrl);
		};
		fetchUrl();
	}, []);

	return (
		<div>
			<a
				href={url}
				download
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 hover:underline text-sm font-semibold">
				Download {linkTextPrefix} Document
			</a>
		</div>
	);
};

export default PresignedDocument;
