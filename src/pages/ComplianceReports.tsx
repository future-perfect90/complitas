import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { createCompliance, getComplianceReports } from '../utils/api';

interface ComplianceReport {
	id: string;
	propertyId: string;
	createdAt: string;
}

export default function ComplianceReports() {
	const { isAuthenticated } = useAuth0();
	const [reports, setReports] = useState<Array<ComplianceReport>>([]);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchQuestionnaires = async () => {
			try {
				const data = await getComplianceReports(id ?? '');
				setReports(data);
			} catch (error) {
				console.error('Error fetching questionnaires:', error);
			}
		};

		if (isAuthenticated) {
			fetchQuestionnaires();
		}
	}, [isAuthenticated]);

	const handleCreation = async () => {
		const complianceId = await createCompliance(id ?? '');
		navigate(`/properties/${id}/compliance-reports/${complianceId}`);
		toast.success('New compliance report created!');
	};

	const handleOpenConfirmation = () => {
		setIsConfirmationModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsConfirmationModalOpen(false);
	};

	return (
		<>
			<div className="flex items-center justify-left">
				<div className="flex-1 justify-left">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Compliance Reports
					</h1>
					<p className="text-gray-300">
						Log compliance activities and responses.
					</p>
				</div>
				<div className="items-center justify-right">
					{/* Maybe put a stop here that once a new one is created it prevents the old one from being edited? */}
					<Button
						label="Create questionnaire"
						onClick={
							reports && reports.length >= 1 ?
								handleOpenConfirmation
							:	handleCreation
						}
						className="px-2 py-1 bg-purple-800 text-white rounded"
					/>
				</div>
			</div>
			<div className="mt-5">
				<Card className="rounded-2xl shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Overview</CardTitle>
					</CardHeader>
					<br />
					<CardContent className="space-y-2 flex">
						{/* ...existing code for displaying fields... */}
						<div className="flex-1 justify-left">
							{reports &&
								reports.map((report) => (
									<div key={report.id}>
										<h3 className="text-lg font-semibold">
											Report from -{' '}
											{new Date(report.createdAt).toLocaleString()} -{' '}
											<a
												href={`/properties/${id}/compliance-reports/${report.id}`}>
												View Report
											</a>
										</h3>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			</div>

			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={handleCloseModal}
				onConfirm={handleCreation}
				title="Create New Compliance Report?"
				message="You already have a compliance report. Do you want to create a new report?"
				confirmText="Yes, Create It"
				confirmButtonClass="bg-blue-600 hover:bg-blue-700"
			/>
		</>
	);
}
