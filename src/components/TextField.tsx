import React from 'react';

interface Props {
	label: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
	disabled?: boolean;
	layout?: 'horizontal' | 'vertical';
}

const TextField: React.FC<Props> = ({
	label,
	value,
	onChange,
	onBlur,
	type,
	required,
	disabled = false,
	layout = 'vertical',
}) => {
	if (layout === 'horizontal') {
		return (
			<div className="flex items-center space-x-2">
				<label className="text-sm font-medium text-gray-700 whitespace-nowrap dark:text-slate-300">
					{label}
				</label>
				<input
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					required={required}
					disabled={disabled}
					className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-slate-300"
				/>
			</div>
		);
	} else {
		return (
			<div className="mb-2">
				<label className="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300">
					{label}
				</label>
				<input
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					required={required}
					className="mt-1 block w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-200 text-gray-900 dark:text-gray-200 dark:bg-gray-600 dark:border-gray-500"
				/>
			</div>
		);
	}
};

export default TextField;
