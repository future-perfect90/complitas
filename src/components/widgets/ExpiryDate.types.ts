export interface Header {
	key: string;
	label: string;
}

export interface RowData {
	id: string | number;
	[key: string]: any;
}

export interface DataHighlightWidgetProps<T extends RowData> {
	title: string;
	headers: Header[];
	rows: T[];
	onRowClick?: (row: T) => void;
	totalRows?: number;
	itemsPerPage?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
}
