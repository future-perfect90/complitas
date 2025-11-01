import React from 'react';
import ValidationError from './ValidationError';

interface Props {
	label: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
	required?: boolean;
	disabled?: boolean;
	error?: string;
}

const Textarea: React.FC<Props> = ({
	label,
	value,
	onChange,
	onBlur,
	required,
	disabled = false,
	error,
}) => {
	const errorClasses =
		error ? 'border-red-500 dark:border-red-300' : 'dark:border-gray-500';

	return (
		<div className="mb-2">
			<label className="flex items-center text-sm font-medium text-[#212529] mb-1 dark:text-slate-300">
				{label}
			</label>
			<textarea
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				required={required}
				disabled={disabled}
				className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:border-[#4D83AF] dark:focus:border-[#6DA0CE] text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 ${errorClasses}`}
			/>
			<ValidationError message={error} />
		</div>
	);
};

export default Textarea;
