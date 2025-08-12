import axios from 'axios';
import type { Company } from '../types';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
});

export async function getCompanies() {
	const r = await api.get<Company[]>('/company/list.php');
	return r.data;
}

export async function getCompany(id: number) {
	const r = await api.get<Company>(`/company/get.php?id=${id}`);
	return r.data;
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
