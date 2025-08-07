import { useEffect, useState } from 'react';
import type { Company } from './types';
// The main component for the application.
// This component renders the company details form with validation.
const ListCompanies = () => {
	// const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	// const [token, setToken] = useState<string | null>(null);
	// useEffect(() => {
	// 	const fetchToken = async () => {
	// 		if (isAuthenticated) {
	// 			try {
	// 				const accessToken = await getAccessTokenSilently({
	// 					authorizationParams: {
	// 						audience: import.meta.env.VITE_AUTH0_AUDIENCE,
	// 					},
	// 				});
	// 				setToken(accessToken);
	// 			} catch (e) {
	// 				console.error(e);
	// 			}
	// 		}
	// 	};
	// 	fetchToken();
	// }, [isAuthenticated, getAccessTokenSilently]);

	// State to store the list of companies.
	const [companies, setCompanies] = useState([]);
	// State for managing loading status.
	const [loading, setLoading] = useState(true);
	// State for managing error messages.
	const [error, setError] = useState(null);

	// useEffect hook to fetch data when the component mounts.
	useEffect(() => {
		// Placeholder URL for your PHP API endpoint.
		const API_URL = `${import.meta.env.VITE_API_BASE_URL}/company/list.php`;

		const fetchCompanies = async () => {
			try {
				const response = await fetch(API_URL, {
					method: 'GET',
					// You would include the JWT from your Auth0 login here
					// headers: {
					// 	Authorization: `Bearer ${token}`,
					// },
				});

				// Handle non-successful responses from the API.
				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				setCompanies(data);
			} catch (e: any) {
				// Catch and display any errors during the fetch.
				setError(e.message);
			} finally {
				// Set loading to false once the request is complete.
				setLoading(false);
			}
		};

		fetchCompanies();
	}, []);

	// Handler for the Edit button.
	const handleEdit = (companyId: number) => {
		// In a real application, you would use React Router to navigate.
		// window.location.href = `/edit-company/${companyId}`;
		alert(`Editing company with ID: ${companyId}`);
		console.log(`Redirecting to edit page for company ID: ${companyId}`);
	};

	// Handler for the Delete button.
	const handleDelete = (companyId: number) => {
		// In a real application, you would send a DELETE request to the API.
		const isConfirmed = window.confirm(
			`Are you sure you want to delete company with ID: ${companyId}?`
		);
		if (isConfirmed) {
			alert(`Deleting company with ID: ${companyId}`);
			console.log(`Deleting company with ID: ${companyId}`);
		}
	};

	// Display loading message while the data is being fetched.
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-gray-700">Loading companies...</p>
			</div>
		);
	}

	// Display error message if the fetch failed.
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-red-500">Error: {error}</p>
			</div>
		);
	}

	// Display a message if there are no companies to show.
	if (companies.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-gray-700">No companies found.</p>
			</div>
		);
	}

	// Render the table with company data.
	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
			<div className="bg-white rounded-xl shadow-2xl overflow-hidden">
				<h1 className="text-3xl font-extrabold text-center p-6 text-gray-900 border-b-2">
					Company List
				</h1>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Company Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Address
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									City
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Country
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Telephone
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{companies.map((company: Company) => (
								<tr key={company.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{company.company_name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{company.address_line_1} {company.address_line_2}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{company.city}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{company.country}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{company.email}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{company.telephone}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => handleEdit(company.id)}
											className="text-indigo-600 hover:text-indigo-900 mr-4">
											Edit
										</button>
										<button
											onClick={() => handleDelete(company.id)}
											className="text-red-600 hover:text-red-900">
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ListCompanies;
