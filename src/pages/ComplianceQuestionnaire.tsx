import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { getAreas } from '../utils/api';

export default function ComplianceReports() {
	const { isAuthenticated } = useAuth0();
	const [areas, setAreas] = useState<Array<{ area: string }>>([]);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchAreas = async () => {
			try {
				const data = await getAreas();
				setAreas(data);
			} catch (error) {
				console.error('Error fetching property:', error);
			}
		};
		if (isAuthenticated) {
			fetchAreas();
		}
	}, [isAuthenticated]);

	// const handleCreation = async () => {
	// 	// Logic for creating a questionnaire
	// 	const complianceId = await createCompliance(id ?? '');
	// 	navigate(`/properties/${id}/compliance-reports/${complianceId}`);
	// };

	return (
		<>
			<div className="flex items-center justify-left">
				<div className="flex-1 justify-left">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Compliance questionnaire to answer stuff
					</h1>
					<p className="text-gray-300">
						Log compliance activities and responses.
					</p>
				</div>
				<div className="items-center justify-right">
					{/* <Button
						label="Create questionnaire"
						// onClick={handleCreation}
						className="px-2 py-1 bg-purple-800 text-white rounded"
					/> */}
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
							{areas &&
								areas.map((area) => (
									<h3 className="text-lg font-semibold">{area.area}</h3>
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
