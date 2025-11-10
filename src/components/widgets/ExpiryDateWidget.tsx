import { Button } from '../Button';
import type { DataHighlightWidgetProps, RowData } from './ExpiryDate.types';

const getExpiryHighlightClass = (expiryDate: any): string => {
	if (
		typeof expiryDate !== 'string' ||
		!/^\d{2}-\d{2}-\d{4}$/.test(expiryDate)
	) {
		return '';
	}

	const parts = expiryDate.split('-');
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1;
	const year = parseInt(parts[2], 10);
	const date = new Date(year, month, day);

	if (isNaN(date.getTime())) {
		return '';
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const diffTime = date.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	console.log('Diff Days:', diffDays);
	if (diffDays <= 30) {
		return 'text-red-600 dark:text-red-400 font-semibold';
	}
	if (diffDays <= 60) {
		return 'text-orange-400 dark:text-orange-400 font-semibold';
	}
	return 'text-green-600 dark:text-green-400 font-semibold';
};
export const DataHighlightWidget = <T extends RowData>({
	title,
	headers = [],
	rows = [],
	onRowClick,
	totalRows,
	itemsPerPage,
	currentPage,
	onPageChange,
}: DataHighlightWidgetProps<T>) => {
	const hasData = rows && rows.length > 0;
	const hasPagination =
		totalRows && itemsPerPage && currentPage && onPageChange && totalRows > 0;
	const totalPages = hasPagination && Math.ceil(totalRows / itemsPerPage);
	const startRow = hasPagination && (currentPage - 1) * itemsPerPage + 1;
	const endRow =
		hasPagination && Math.min(currentPage * itemsPerPage, totalRows);

	return (
		<div className="font-sans bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950/50 p-6 flex flex-col">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				{title}
			</h3>
			<div className="flex-1 overflow-hidden flex flex-col">
				{!hasData && (
					<div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 italic">
						<p>No data to display.</p>
					</div>
				)}

				{hasData && (
					<div className="flex-1 overflow-y-auto">
						<table className="w-full border-collapse">
							<thead className="sticky top-0 bg-white dark:bg-gray-800">
								<tr>
									{headers.map((header) => (
										<th
											key={header.key}
											className="p-3 pt-0 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											{header.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
									<tr
										key={row.id}
										onClick={() => onRowClick?.(row)}
										className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
											onRowClick ? 'cursor-pointer' : ''
										}`}>
										{headers.map((header) => (
											<td
												key={`${row.id}-${header.key}`}
												className={`p-3 text-left align-middle border-b border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 ${
													header.key === 'expiryDate' ?
														getExpiryHighlightClass(row.expiryDate)
													:	''
												}`}>
												{row[header.key]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{hasPagination && totalPages > 1 && (
					<div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Showing {startRow} to {endRow} of {totalRows} results
						</span>
						<div className="flex gap-2">
							<Button
								label="Previous"
								onClick={() => onPageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-4 py-1.5"
								style="secondary"
							/>
							<span className="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								label="Next"
								onClick={() => onPageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-4 py-1.5"
								style="secondary"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
