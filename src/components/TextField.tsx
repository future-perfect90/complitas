import React from 'react';

interface Props {
	label: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
}

const TextField: React.FC<Props> = ({
	label,
	value,
	onChange,
	type,
	required,
}) => {
	console.log('Label:', label, type);
	return (
		<div className="mb-2">
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				required={required}
				className="mt-1 block w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-900"
			/>
		</div>
	);
};

export default TextField;
