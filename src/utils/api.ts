import type { Company, Property } from '../types';

const jwt = localStorage.getItem('auth_token');

export async function getCompanies() {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/list.php`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	console.log(response);
	return response.json();
}

export async function getCompany(id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/get.php?id=${id}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function createCompany(payload: Company) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/add.php`,
		{
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function updateCompany(payload: Company, id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/update.php`,
		{
			method: 'PUT',
			body: JSON.stringify({ payload, id }),
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.ok;
}

export async function deleteCompany(id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/company/delete.php?id=${id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.ok;
}

export async function getProperties(companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/list.php?companyId=${companyId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	console.log(response);
	return response.json();
}

export async function getProperty(id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/get.php?id=${id}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function createProperty(payload: Property, companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/add.php`,
		{
			method: 'POST',
			body: JSON.stringify({ payload, companyId }),
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function updateProperty(payload: Property, id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/update.php`,
		{
			method: 'PUT',
			body: JSON.stringify({ payload, id }),
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.ok;
}

export async function deleteProperty(id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/delete.php?id=${id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.ok;
}
