import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { createCompliance, getComplianceQuestionnaires } from '../utils/api';

export default function ComplianceReports() {
	const { isAuthenticated } = useAuth0();
	const [questionnaires, setQuestionnaires] = useState<
		Array<{ id: string; propertyId: string }>
	>([]);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchQuestionnaires = async () => {
			try {
				const data = await getComplianceQuestionnaires(id ?? '');
				setQuestionnaires(data);
			} catch (error) {
				console.error('Error fetching questionnaires:', error);
			}
		};

		if (isAuthenticated) {
			// fetchAreas();
			fetchQuestionnaires();
		}
	}, [isAuthenticated]);

	const handleCreation = async () => {
		// Logic for creating a questionnaire
		const complianceId = await createCompliance(id ?? '');
		console.log(complianceId);
		navigate(`/properties/${id}/compliance-reports/${complianceId}`);
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
						onClick={handleCreation}
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
							{questionnaires &&
								questionnaires.map((questionnaire) => (
									<div key={questionnaire.id}>
										<h3 className="text-lg font-semibold">
											{questionnaire.id}
										</h3>
										<a
											href={`/properties/${id}/compliance-reports/${questionnaire.id}`}>
											View Report
										</a>
									</div>
								))}
							{/* Additional content can go here */}
							Lets put some compliance reports here
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
