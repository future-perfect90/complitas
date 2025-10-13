import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import LoadingSpinner from '../components/Loading';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import { useAuthMeta } from '../context/AuthProvider';
import type { ProfileData } from '../types';
import { getProfile } from '../utils/api';

export default function Profile() {
	const authMeta = useAuthMeta();
	const { isLoading, isAuthenticated, userUuid, auth0sub } = authMeta;
	const [profile, setProfile] = useState<ProfileData>();
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isProfileLoading, setIsProfileLoading] = useState(true);

	useEffect(() => {
		const fetchClaimsAndData = async () => {
			setIsProfileLoading(true);
			if (userUuid) {
				try {
					const { data } = await getProfile(userUuid);
					setProfile(data);
				} catch (error) {
					console.error('Error fetching profile:', error);
				} finally {
					setIsProfileLoading(false);
				}
			}
		};

		if (isAuthenticated && !isLoading) {
			fetchClaimsAndData();
		}
	}, [isAuthenticated, userUuid]);

	const handlePasswordSuccess = () => {
		setIsPasswordModalOpen(false);
		toast.success('Password updated successfully!');
	};

	if (isLoading || isProfileLoading) {
		return <LoadingSpinner message={'Loading profile...'} />;
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Page Header */}
				<div className="flex items-center gap-6">
					<div>
						<h1 className="text-3xl font-bold text-[#212529] dark:text-[#F8F9FA]">
							My Profile
						</h1>
						<p className="text-[#6C757D] dark:text-[#ADB5BD]">
							Manage your personal information, assigned teams, and properties.
						</p>
					</div>
				</div>
				{profile && profile.profile ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader className="flex justify-between items-center">
							<CardTitle className="text-xl font-semibold">
								Personal Details
							</CardTitle>
						</CardHeader>
						<br />
						<CardContent className="space-y-4 flex flex-col sm:flex-row sm:justify-between">
							<div>
								<p className="text-sm text-[#6C757D] dark:text-[#F8F9FA]">
									Name
								</p>
								<p className="text-[#212529] dark:text-[#F8F9FA]">
									{profile?.profile.name}
								</p>
							</div>
							<div>
								<p className="text-sm text-[#6C757D] dark:text-[#F8F9FA]">
									Email
								</p>
								<p className="text-[#212529] dark:text-[#F8F9FA]">
									{profile?.profile.email}
								</p>
							</div>
							<div>
								<Button
									label="Change Password"
									onClick={() => setIsPasswordModalOpen(true)}
									className="px-4 py-2 bg-blue-600 text-[#F8F9FA] hover:bg-blue-700 float-right"
								/>
							</div>
						</CardContent>
					</Card>
				:	<p className="text-[#6C757D] dark:text-[#F8F9FA]">No profile data.</p>}

				{/* Teams Section
				{profile && profile.teams && profile.teams.length > 0 ?
					<Card className="rounded-2xl shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">Teams</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{profile?.teams.map((team) => (
								<div
									key={team.id}
									className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#212529] dark:text-[#F8F9FA]">
									{team.name}
								</div>
							))}
						</CardContent>
					</Card>
				:	<p className="text-[#6C757D] dark:text-[#F8F9FA]">No teams assigned.</p>} */}

				{/* Properties Section
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
									className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all text-[#212529] dark:text-[#F8F9FA] border border-gray-200 dark:border-gray-700">
									<h3 className="text-lg font-medium">{property.name}</h3>
									<p className="text-sm text-blue-600 dark:text-blue-400">
										View details →
									</p>
								</a>
							))}
						</CardContent>
					</Card>
				:	<p className="text-[#6C757D] dark:text-[#F8F9FA]">
						No properties assigned.
					</p>
				} */}
				{auth0sub && (
					<ChangePasswordModal
						isOpen={isPasswordModalOpen}
						onClose={() => setIsPasswordModalOpen(false)}
						onSuccess={handlePasswordSuccess}
						userUuid={auth0sub}
					/>
				)}
			</div>
		</div>
	);
}
