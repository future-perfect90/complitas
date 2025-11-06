import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataHighlightWidget } from '../components/ExpiryDateWidget/ExpiryDateWidget';

import AssignedPropertiesWidget from '../components/AssignedPropertiesWidget';
import type { Header, RowData } from '../components/ExpiryDateWidget/types';
import { useAuthMeta } from '../context/AuthProvider';
import { getExpiringCerts } from '../utils/api';

const expiringCertsHeaders: Header[] = [
	{ key: 'propertyName', label: 'Property' },
	{ key: 'area', label: 'Area' },
	{ key: 'question', label: 'Certification' },
	{ key: 'expiryDate', label: 'Expires On' },
];

interface ExpiringCert extends RowData {
	propertyId: string;
	propertyName: string;
	expiryDate: string;
	question: string;
	area: string;
	auditId: string;
}

export default function Dashboard() {
	const authMeta = useAuthMeta();
	const { isAuthenticated, isLoading } = authMeta;
	const [expiringCerts, setExpiringCerts] = useState<ExpiringCert[]>([]);
	const [totalCerts, setTotalCerts] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			const fetchCerts = async () => {
				try {
					const response = await getExpiringCerts(currentPage, itemsPerPage);
					setTotalCerts(response.total);
					setExpiringCerts(
						response.data.map((item: any) => ({
							...item,
							id: `${item.propertyId}-${item.auditId}-${item.question.replace(/\s/g, '-')}`,
						}))
					);
				} catch (error) {
					console.error('Failed to fetch expiring certs', error);
					// Reset state on error
					setExpiringCerts([]);
					setTotalCerts(0);
				}
			};
			fetchCerts();
		}
	}, [isAuthenticated, currentPage]);
	const handleRowClick = (row: RowData) => {
		const cert = row as ExpiringCert;
		if (cert.propertyId && cert.auditId) {
			navigate(
				`/properties/${cert.propertyId}/compliance-audits/${cert.auditId}`
			);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="flex flex-col gap-6">
			{isAuthenticated ?
				<>
					<div className="flex flex-col gap-6">
						<h2 className="text-3xl">Welcome to Complitas</h2>
						<br />
						<DataHighlightWidget<ExpiringCert>
							title="Expiring Certifications (Next 3 Months)"
							headers={expiringCertsHeaders}
							rows={expiringCerts}
							totalRows={totalCerts}
							itemsPerPage={itemsPerPage}
							currentPage={currentPage}
							onPageChange={setCurrentPage}
							onRowClick={handleRowClick}
						/>
						<br />
					</div>
					<div className="flex flex-col gap-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							My Assigned Properties
						</h3>
						<AssignedPropertiesWidget />
					</div>
				</>
			:	'Error: Getting user information failed. Please try again later.'}
		</div>
	);
}
