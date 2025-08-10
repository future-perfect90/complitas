import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import type { ErrorsType } from './types';
// The main component for the application.
// This component renders the company details form with validation.
const AddCompany = () => {
	const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
		useAuth0();
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		const fetchToken = async () => {
			if (isAuthenticated) {
				try {
					const accessToken = await getAccessTokenSilently({
						authorizationParams: {
							audience: import.meta.env.VITE_AUTH0_AUDIENCE,
						},
					});
					setToken(accessToken);
				} catch (e) {
					console.error(e);
				}
			}
		};
		fetchToken();
	}, [isAuthenticated, getAccessTokenSilently]);

	console.log('AddCompany', {
		user,
		isAuthenticated,
		isLoading,
	});
	// Initial state for the form data, matching the database fields.
	const [formData, setFormData] = useState({
		company_name: '',
		address_line_1: '',
		address_line_2: '',
		address_line_3: '',
		city: '',
		county: '',
		post_code: '',
		country: '',
		vat_no: '',
		company_reg_no: '',
		email: '',
		telephone: '',
	});

	// State to hold validation errors for each field.
	const [errors, setErrors] = useState<ErrorsType>({});

	// Handles input changes and updates the form data state.
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Validates the form data and returns a boolean.
	const validate = () => {
		let newErrors = {};
		let isValid = true;

		setErrors(newErrors);
		return isValid;
	};

	// Handles form submission.
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validate()) {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/company/add.php`,
					{
						method: 'POST',
						body: JSON.stringify(formData),
						// You would include the JWT from your Auth0 login here
						// headers: {
						// 	Authorization: `Bearer ${token}`,
						// },
					}
				);

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}
				await response.json();
			} catch (error: any) {
				console.error(error);
			} finally {
			}
		} else {
			// Validation failed. Errors are already in the state and displayed.
			alert('Please correct the form errors.');
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
			<div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl">
				<h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
					Company Registration Form
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Company Name */}
						<div>
							<label
								htmlFor="company_name"
								className="block text-sm font-medium text-gray-700">
								Company Name
							</label>
							<input
								type="text"
								id="company_name"
								name="company_name"
								value={formData.company_name}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.company_name ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.company_name && (
								<p className="mt-1 text-sm text-red-600">
									{errors.company_name}
								</p>
							)}
						</div>

						{/* Address Line 1 */}
						<div>
							<label
								htmlFor="address_line_1"
								className="block text-sm font-medium text-gray-700">
								Address Line 1
							</label>
							<input
								type="text"
								id="address_line_1"
								name="address_line_1"
								value={formData.address_line_1}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.address_line_1 ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.address_line_1 && (
								<p className="mt-1 text-sm text-red-600">
									{errors.address_line_1}
								</p>
							)}
						</div>

						{/* Address Line 2 */}
						<div>
							<label
								htmlFor="address_line_2"
								className="block text-sm font-medium text-gray-700">
								Address Line 2
							</label>
							<input
								type="text"
								id="address_line_2"
								name="address_line_2"
								value={formData.address_line_2}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
							/>
						</div>

						{/* Address Line 3 */}
						<div>
							<label
								htmlFor="address_line_3"
								className="block text-sm font-medium text-gray-700">
								Address Line 3
							</label>
							<input
								type="text"
								id="address_line_3"
								name="address_line_3"
								value={formData.address_line_3}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
							/>
						</div>

						{/* City */}
						<div>
							<label
								htmlFor="city"
								className="block text-sm font-medium text-gray-700">
								City
							</label>
							<input
								type="text"
								id="city"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.city ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.city && (
								<p className="mt-1 text-sm text-red-600">{errors.city}</p>
							)}
						</div>

						{/* County */}
						<div>
							<label
								htmlFor="county"
								className="block text-sm font-medium text-gray-700">
								County
							</label>
							<input
								type="text"
								id="county"
								name="county"
								value={formData.county}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
								required
							/>
						</div>

						{/* Post Code */}
						<div>
							<label
								htmlFor="post_code"
								className="block text-sm font-medium text-gray-700">
								Post Code
							</label>
							<input
								type="text"
								id="post_code"
								name="post_code"
								value={formData.post_code}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.post_code ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.post_code && (
								<p className="mt-1 text-sm text-red-600">{errors.post_code}</p>
							)}
						</div>

						{/* Country */}
						<div>
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-700">
								Country
							</label>
							<input
								type="text"
								id="country"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.country ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.country && (
								<p className="mt-1 text-sm text-red-600">{errors.country}</p>
							)}
						</div>

						{/* VAT No */}
						<div>
							<label
								htmlFor="vat_no"
								className="block text-sm font-medium text-gray-700">
								VAT No.
							</label>
							<input
								type="text"
								id="vat_no"
								name="vat_no"
								value={formData.vat_no}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
							/>
						</div>

						{/* Company Reg No */}
						<div>
							<label
								htmlFor="company_reg_no"
								className="block text-sm font-medium text-gray-700">
								Company Reg No.
							</label>
							<input
								type="text"
								id="company_reg_no"
								name="company_reg_no"
								value={formData.company_reg_no}
								onChange={handleChange}
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
							/>
						</div>

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.email ? 'border-red-500' : 'border-gray-300'
								}`}
							/>{' '}
							required
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>

						{/* Telephone */}
						<div>
							<label
								htmlFor="telephone"
								className="block text-sm font-medium text-gray-700">
								Telephone
							</label>
							<input
								type="tel"
								id="telephone"
								name="telephone"
								value={formData.telephone}
								onChange={handleChange}
								className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
									errors.telephone ? 'border-red-500' : 'border-gray-300'
								}`}
								required
							/>
							{errors.telephone && (
								<p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
							)}
						</div>
					</div>
					<div className="flex justify-end">
						<button
							type="submit"
							className="w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddCompany;
