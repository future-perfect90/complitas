import { useMemo } from 'react';

export function useSearch<T>(
	items: T[],
	searchTerm: string,
	searchKeys: (keyof T)[]
) {
	const filteredItems = useMemo(() => {
		if (!searchTerm) {
			return items;
		}

		const lowercasedTerm = searchTerm.toLowerCase();

		return items.filter((item) =>
			searchKeys.some((key) => {
				const value = item[key];
				return String(value).toLowerCase().includes(lowercasedTerm);
			})
		);
	}, [items, searchTerm, searchKeys]);

	return filteredItems;
}
