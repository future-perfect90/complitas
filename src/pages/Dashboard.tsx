import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	DataHighlightWidget,
	type Header,
	type RowData,
} from '../components/DashboardWidget';
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
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			const fetchCerts = async () => {
				try {
					const data = await getExpiringCerts();
					setExpiringCerts(
						data.map((item: any) => ({
							...item,
							id: `${item.propertyId}-${item.auditId}-${item.question.replace(/\s/g, '-')}`,
						}))
					);
				} catch (error) {
					console.error('Failed to fetch expiring certs', error);
				}
			};
			fetchCerts();
		}
	}, [isAuthenticated]);
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
		<>
			{isAuthenticated ?
				<>
					<h2 className="text-3xl">Welcome to your dashboard</h2>
					<br />
					<p>
						This is your personal dashboard where you can manage your settings
						and view your data.
					</p>
					<br />
					<DataHighlightWidget<ExpiringCert>
						title="Expiring Certifications (Next 3 Months)"
						headers={expiringCertsHeaders}
						rows={expiringCerts}
						onRowClick={handleRowClick}
					/>
				</>
			:	'Error: Getting user information failed. Please try again later.'}
		</>
	);
}
