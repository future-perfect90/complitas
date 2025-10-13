import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthMeta } from '../context/AuthProvider';
import { createComplianceAudit, getComplianceAudits } from '../utils/api';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import ConfirmationModal from './modals/ConfirmationModal';
import LoadingSpinner from './modals/Loading';

interface ComplianceAudit {
	id: string;
	propertyId: string;
	createdAt: string;
}

export const ComplianceAuditList = () => {
	const authMeta = useAuthMeta();
	const { isLoading, isAuthenticated } = authMeta;
	const [audits, setAudits] = useState<Array<ComplianceAudit>>([]);
	const [isAuditsLoading, setIsAuditsLoading] = useState(true);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchAudits = async () => {
			if (!id) return;
			try {
				setIsAuditsLoading(true);
				const data = await getComplianceAudits(id);
				setAudits(data);
			} catch (error) {
				console.error('Error fetching audits:', error);
			} finally {
				setIsAuditsLoading(false);
			}
		};

		if (!isLoading && isAuthenticated) {
			fetchAudits();
		}
	}, [id, isLoading, isAuthenticated]);

	const handleCreation = async () => {
		if (!id) return;
		const complianceId = await createComplianceAudit(id);
		navigate(`/properties/${id}/compliance-audits/${complianceId}`);
		toast.success('New compliance audit created!');
	};

	if (isLoading || isAuditsLoading) {
		return <LoadingSpinner message={'Loading audits...'} />;
	}

	return (
		<>
			<Card className="rounded-2xl shadow-lg">
				<CardHeader className="flex">
					<CardTitle className="text-xl font-semibold">
						Audits
						<Button
							label="Create audit"
							onClick={
								audits && audits.length >= 1 ?
									() => setIsConfirmationModalOpen(true)
								:	handleCreation
							}
							className="px-2 py-1 bg-purple-800 text-white rounded float-right"
						/>
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="space-y-4">
						{audits && audits.length > 0 ?
							audits.map((audit) => (
								<div
									key={audit.id}
									className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">
										Audit from - {new Date(audit.createdAt).toLocaleString()}
									</h3>
									<div className="flex gap-2">
										<Button
											label="Update audit"
											onClick={() =>
												navigate(
													`/properties/${id}/compliance-audits/${audit.id}`
												)
											}
											className="px-2 py-1 bg-green-800 text-white rounded"
										/>
										<Button
											label="View audit"
											onClick={() =>
												navigate(
													`/properties/${id}/compliance-audits/${audit.id}/pdf`
												)
											}
											className="px-2 py-1 bg-blue-800 text-white rounded"
										/>
									</div>
								</div>
							))
						:	<p>No compliance audits found for this property.</p>}
					</div>
				</CardContent>
			</Card>
			<ConfirmationModal
				isOpen={isConfirmationModalOpen}
				onClose={() => setIsConfirmationModalOpen(false)}
				onConfirm={handleCreation}
				title="Create New Compliance Audit?"
				message="You already have a compliance audit. Do you want to create a new audit?"
				confirmText="Yes, Create It"
				confirmButtonClass="bg-blue-600 hover:bg-blue-700"
			/>
		</>
	);
};
