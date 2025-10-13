import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../context/AuthProvider';
import { createCompliance, getComplianceReports } from '../utils/api';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import ConfirmationModal from './modals/ConfirmationModal';
import LoadingSpinner from './modals/Loading';

interface ComplianceReport {
	id: string;
	propertyId: string;
	createdAt: string;
}

export const ComplianceReportList = () => {
	const authMeta = useAuthMeta();
	const { isLoading, isAuthenticated } = authMeta;
	const [reports, setReports] = useState<Array<ComplianceReport>>([]);
	const [isReportsLoading, setIsReportsLoading] = useState(true);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchAudits = async () => {
			if (!id) return;
			try {
				setIsReportsLoading(true);
				const data = await getComplianceReports(id);
				setReports(data);
			} catch (error) {
				console.error('Error fetching audits:', error);
			} finally {
				setIsReportsLoading(false);
			}
		};

		if (!isLoading && isAuthenticated) {
			fetchAudits();
		}
	}, [id, isLoading, isAuthenticated]);

	const handleCreation = async () => {
		if (!id) return;
		const complianceId = await createCompliance(id);
		navigate(`/properties/${id}/compliance-reports/${complianceId}`);
		toast.success('New compliance report created!');
	};

	if (isLoading || isReportsLoading) {
		return <LoadingSpinner message={'Loading reports...'} />;
	}

	return (
		<>
			<Card className="rounded-2xl shadow-lg">
				<CardHeader className="flex">
					<CardTitle className="text-xl font-semibold">
						Reports
						<Button
							label="Create Report"
							onClick={
								reports && reports.length >= 1 ?
									() => setIsConfirmationModalOpen(true)
								:	handleCreation
							}
							className="px-2 py-1 bg-purple-800 text-white rounded float-right"
						/>
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="space-y-4">
						{reports && reports.length > 0 ?
							reports.map((report) => (
								<div
									key={report.id}
									className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">
										Report from - {new Date(report.createdAt).toLocaleString()}
									</h3>
									<div className="flex gap-2">
										<Button
											label="Update Report"
											onClick={() =>
												navigate(
													`/properties/${id}/compliance-reports/${report.id}`
												)
											}
											className="px-2 py-1 bg-green-800 text-white rounded"
										/>
										<Button
											label="View Report"
											onClick={() =>
												navigate(
													`/properties/${id}/compliance-reports/${report.id}/pdf`
												)
											}
											className="px-2 py-1 bg-blue-800 text-white rounded"
										/>
									</div>
								</div>
							))
						:	<p>No compliance reports found for this property.</p>}
					</div>
				</CardContent>
			</Card>
			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={() => setIsConfirmationModalOpen(false)}
				onConfirm={handleCreation}
				title="Create New Compliance Report?"
				message="You already have a compliance report. Do you want to create a new report?"
				confirmText="Yes, Create It"
				confirmButtonClass="bg-blue-600 hover:bg-blue-700"
			/>
		</>
	);
};
