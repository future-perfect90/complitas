import { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import TextField from '../components/TextField';

export default function Profile() {
	// Example mock data
	const teams = [
		'NEED TO GET FROM API',
		'Engineering',
		'Compliance',
		'Support',
	];
	const properties = [
		{ id: 0, name: 'GET FROM API' },
		{ id: 1, name: 'Sunset Villas' },
		{ id: 2, name: 'Downtown Offices' },
		{ id: 3, name: 'Greenfield Apartments' },
	];

	const [isEditing, setIsEditing] = useState(false);
	const [details, setDetails] = useState({
		name: 'Jane Doe',
		email: 'jane.doe@example.com',
	});

	const [avatarUrl, setAvatarUrl] = useState(
		'https://via.placeholder.com/150?text=Avatar' // fallback placeholder
	);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleEditToggle = () => setIsEditing(!isEditing);

	// Handle avatar upload
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			// 1. Call your backend to get a presigned URL
			const res = await fetch('/api/presign', {
				method: 'POST',
				body: JSON.stringify({ filename: file.name, type: file.type }),
				headers: { 'Content-Type': 'application/json' },
			});
			const { url, fileUrl } = await res.json();

			// 2. Upload file to S3
			await fetch(url, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file,
			});

			// 3. Update avatar preview
			setAvatarUrl(fileUrl);
		} catch (err) {
			console.error('Avatar upload failed', err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Page Header */}
				<div className="flex items-center gap-6">
					<div className="relative">
						<img
							src={avatarUrl}
							alt="Profile Avatar"
							className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
						/>
						<Button
							className="absolute bottom-0 right-0"
							onClick={() => fileInputRef.current?.click()}
							label="Change"
						/>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
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
				<Card className="rounded-2xl shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Teams</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{teams.map((team) => (
							<div
								key={team}
								className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
								{team}
							</div>
						))}
					</CardContent>
				</Card>

				{/* Properties Section */}
				<Card className="rounded-2xl shadow-lg">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Properties</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{properties.map((property) => (
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

				{/* Personal Details Section */}
				<Card className="rounded-2xl shadow-lg">
					<CardHeader className="flex justify-between items-center">
						<CardTitle className="text-xl font-semibold">
							Personal Details
						</CardTitle>
						<Button
							onClick={handleEditToggle}
							className="ml-auto"
							label={`${isEditing ? 'Cancel' : 'Edit'}`}
						/>
					</CardHeader>
					<CardContent className="space-y-4">
						{!isEditing ?
							<>
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Name
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{details.name}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Email
									</p>
									<p className="text-gray-900 dark:text-gray-100">
										{details.email}
									</p>
								</div>
							</>
						:	<>
								<div>
									<TextField
										label="Name"
										value={details.name}
										onChange={(e: any) =>
											setDetails({ ...details, name: e.target.value })
										}
									/>
								</div>
								<div>
									<TextField
										label="Email"
										value={details.email}
										onChange={(e: any) =>
											setDetails({ ...details, email: e.target.value })
										}
									/>
								</div>
								<div>
									<TextField label="Password" type="password" value="" />
								</div>
								<Button className="w-full" label="Save Changes" />
							</>
						}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
