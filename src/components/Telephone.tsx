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
			<label className="block text-sm font-medium text-[#212529] mb-1 dark:text-slate-300">
				{label}
			</label>
			<PhoneInput
				defaultCountry="gb"
				value={value ?? ''}
				onChange={(phone) => onChange?.(phone)}
				required={required}
				className="py-0.5 border rounded-md shadow-sm focus:outline-none focus:border-[#4D83AF] dark:focus:border-[#6DA0CE] text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 dark:border-gray-500 bg-white"
				inputClassName="border-none! text-md font-medium dark:text-[#F8F9FA]! dark:bg-gray-600! dark:border-gray-500! bg-white!"
				countrySelectorStyleProps={{
					buttonClassName:
						'px-2! border-none! dark:text-[#F8F9FA]! dark:bg-gray-600! dark:border-gray-500!',
				}}
			/>
		</div>
	);
};

export default Telephone;
