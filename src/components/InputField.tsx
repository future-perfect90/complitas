type TextInputType = {
	placeholder: string;
	text: string;
	onChange: any;
};

export const TextInput = ({ placeholder, text, onChange }: TextInputType) => {
	return (
		<input
			type="text"
			placeholder={placeholder}
			value={text}
			onChange={onChange}
			className="w-lg p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-900"
		/>
	);
};
