import { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import type { Company } from './types';

const ListCompanies = () => {
	//TODO::Add in authed access only
	// const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	// const [token, setToken] = useState<string | null>(null);

	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
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

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				setCompanies(data);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCompanies();
	}, []);

	const filteredCompanies = companies.filter((company: Company) =>
		company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const tableHeadings = [
		{ key: 'company_name', label: 'Company Name' },
		{ key: 'address_line_1', label: 'Address' },
		{ key: 'city', label: 'City' },
		{ key: 'country', label: 'Country' },
		{ key: 'email', label: 'Email' },
		{ key: 'telephone', label: 'Telephone' },
	];

	// Handler for the Edit button.
	const handleEdit = (companyId: number) => {
		//TODO::Handle edit company
		alert(`Editing company with ID: ${companyId}`);
		console.log(`Redirecting to edit page for company ID: ${companyId}`);
	};

	const handleDelete = (companyId: number) => {
		//TODO::Handle delete company
		const isConfirmed = window.confirm(
			`Are you sure you want to delete company with ID: ${companyId}?`
		);
		if (isConfirmed) {
			alert(`Deleting company with ID: ${companyId}`);
			console.log(`Deleting company with ID: ${companyId}`);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-gray-700">Loading companies...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-red-500">Error: {error}</p>
			</div>
		);
	}

	if (companies.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl text-gray-700">No companies found.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
			<div className="bg-white rounded-xl shadow-2xl overflow-hidden">
				<h1 className="text-3xl font-extrabold text-center p-6 text-gray-900 border-b-2">
					Company List
				</h1>
				<div className="p-4">
					<input
						type="text"
						placeholder="Search by company name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-900"
					/>
				</div>
				{filteredCompanies.length > 0 ?
					<DataTable
						data={filteredCompanies}
						headings={tableHeadings}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
					/>
				:	<div className="p-4 text-center text-gray-500">
						No companies found matching your search.
					</div>
				}
			</div>
		</div>
	);
};

export default ListCompanies;
