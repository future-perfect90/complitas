import type { Company } from '../types';

const jwt = localStorage.getItem('auth_token');

export async function getCompanies() {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/list.php`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	console.log(response);
	return response.json();
}

export async function getCompany(id: number) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/get.php?id=${id}`,
		{
			method: 'GET',
			// You would include the JWT from your Auth0 login here
			// headers: {
			// 	Authorization: `Bearer ${token}`,
			// },
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function createCompany(payload: Company) {
	await fetch(`${import.meta.env.VITE_API_BASE_URL}/company/add.php`, {
		method: 'POST',
		body: JSON.stringify(payload),
		// You would include the JWT from your Auth0 login here
		// headers: {
		// 	Authorization: `Bearer ${token}`,
		// },
	});
}

export async function updateCompany(payload: Company) {
	await fetch(`${import.meta.env.VITE_API_BASE_URL}/company/update.php`, {
		method: 'PUT',
		body: JSON.stringify(payload),
		// You would include the JWT from your Auth0 login here
		// headers: {
		// 	Authorization: `Bearer ${token}`,
		// },
	});
}

export async function deleteCompany(id: number) {
	await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/delete.php?id=${id}`,
		{
			method: 'DELETE',
			// You would include the JWT from your Auth0 login here
			// headers: {
			// 	Authorization: `Bearer ${token}`,
			// },
		}
	);
}
