import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import type { ProfileData } from '../types';
import { getProfile } from '../utils/api';

export default function Profile() {
	const { user, isAuthenticated } = useAuth0();
	const [profile, setProfile] = useState<ProfileData>();

	useEffect(() => {
		const fetchClaimsAndData = async () => {
			const uuid = user?.['https://complitas.dev/user_uuid'];
			if (uuid) {
				try {
					const { data } = await getProfile(uuid);
					setProfile(data);
				} catch (error) {
					console.error('Error fetching teams:', error);
				}
			}
		};

		if (isAuthenticated) {
			fetchClaimsAndData();
		}
	}, [isAuthenticated]);

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Page Header */}
				<div className="flex items-center gap-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							My Profile
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Manage your personal information, assigned teams, and properties.
						</p>
					</div>
				</div>

				{/* Teams Section */}
				{profile && profile.teams && profile.teams.length > 0 ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">Teams</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{profile?.teams.map((team) => (
								<div
									key={team.id}
									className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
									{team.name}
								</div>
							))}
						</CardContent>
					</Card>
				:	<p className="text-gray-500 dark:text-gray-400">No teams assigned.</p>}

				{/* Properties Section */}
				{profile && profile.properties && profile.properties.length > 0 ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								Properties
							</CardTitle>
						</CardHeader>
						<br />
						<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{profile?.properties.map((property) => (
								<a
									key={property.id}
									href={`/properties/${property.id}`}
									className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
									<h3 className="text-lg font-medium">{property.name}</h3>
									<p className="text-sm text-blue-600 dark:text-blue-400">
										View details →
									</p>
								</a>
							))}
						</CardContent>
					</Card>
				:	<p className="text-gray-500 dark:text-gray-400">
						No properties assigned.
					</p>
				}

				{/* Personal Details Section */}
				{profile && profile.profile ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader className="flex justify-between items-center">
							<CardTitle className="text-xl font-semibold">
								Personal Details
							</CardTitle>
						</CardHeader>
						<br />
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
								<p className="text-gray-900 dark:text-gray-100">
									{profile?.profile.name}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Email
								</p>
								<p className="text-gray-900 dark:text-gray-100">
									{profile?.profile.email}
								</p>
							</div>
						</CardContent>
					</Card>
				:	<p className="text-gray-500 dark:text-gray-400">No profile data.</p>}
			</div>
		</div>
	);
}
