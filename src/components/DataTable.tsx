import { Button } from './Button';
type TableProps = {
	headings: HeadingProps[];
	data: DataProps[];
	handleEdit: any;
	handleDelete: any;
};

type HeadingProps = {
	key: string;
	label: string;
};
type DataProps = {
	id: string;
	[key: string]: string;
};

export const DataTable = ({
	headings,
	data,
	handleEdit,
	handleDelete,
}: TableProps) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						{headings.map((heading) => (
							<th
								key={heading.key}
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{heading.label}
							</th>
						))}
						<th
							scope="col"
							className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{data.map((item) => (
						<tr key={item.id}>
							{headings.map((heading) => (
								<td
									key={heading.key}
									className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{item[heading.key]}
								</td>
							))}
							<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<Button
									onClick={() => handleEdit(item.id)}
									label="Edit"
									className={'bg-indigo-900'}
								/>
								<Button
									onClick={() => handleDelete(item.id)}
									label="Delete"
									className={'bg-red-900'}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
