import React from 'react';

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChange,
	placeholder = 'Search...',
}) => (
	<input
		type="text"
		placeholder={placeholder}
		value={value}
		onChange={(e) => onChange(e.target.value)}
		className="px-4 py-2 border rounded-md w-full sm:w-64 bg-white text-gray-900 placeholder-gray-500"
	/>
);

export default SearchInput;
