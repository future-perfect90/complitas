import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { getAreas } from '../utils/api';

export default function ComplianceReports() {
	const { isAuthenticated } = useAuth0();
	const [areas, setAreas] = useState<Array<{ area: string }>>([]);

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

    return (
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
	);
}
