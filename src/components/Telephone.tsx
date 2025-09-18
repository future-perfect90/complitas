import React from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface Props {
	label: string;
	value: string;
	onChange?: (value: string) => void;
	required?: boolean;
}

const Telephone: React.FC<Props> = ({ label, value, onChange, required }) => {
	return (
		<div className="mb-2">
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<PhoneInput
				defaultCountry="gb"
				value={value ?? ''}
				onChange={(phone) => onChange?.(phone)}
				required={required}
				className="py-0.5 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-900"
				inputClassName="border-none! text-md font-medium"
				countrySelectorStyleProps={{
					buttonClassName: 'px-2! border-none!',
				}}
			/>
		</div>
	);
};

export default Telephone;
