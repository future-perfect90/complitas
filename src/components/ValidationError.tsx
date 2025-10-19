import React from 'react';

interface Props {
	message?: string;
}

const ValidationError: React.FC<Props> = ({ message }) => {
	if (!message) {
		return null;
	}

	return (
		<p className="text-red-600 dark:text-red-300 text-sm mt-1">{message}</p>
	);
};

export default ValidationError;
