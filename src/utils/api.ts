export interface Answer {
	questionId: string;
	response: 'Yes' | 'No' | 'NA' | null;
	fileUrl?: string;
	fileName?: string;
}

// Update a section of property data by key-value array

export async function updatePropertySection(
	id: string,
	data: Record<string, any>
) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/update.php`,
		{
			method: 'PUT',
			body: JSON.stringify({ id, data }),
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
import type { MultiValue } from 'react-select';
import type { Company, Property, User } from '../types';

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

export async function updateProperty(data: Property, id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/properties/update.php`,
		{
			method: 'PUT',
			body: JSON.stringify({ data, id }),
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

export async function createUser(payload: User, companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/user-management/add.php`,
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

export async function getUsers(companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/user-management/list.php?companyId=${companyId}`,
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

export async function createTeam(name: string, companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/add.php`,
		{
			method: 'POST',
			body: JSON.stringify({ name, companyId }),
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
interface MultiValueOption {
	value: string;
	name: string;
}

export async function assignToTeam(
	userId: MultiValue<MultiValueOption>,
	teamId: string
) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/assignToTeam.php`,
		{
			method: 'POST',
			body: JSON.stringify({ userId, teamId }),
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

export async function assignTeamToProperty(
	propertyId: MultiValue<MultiValueOption>,
	teamId: string
) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/assignTeamToProperty.php`,
		{
			method: 'POST',
			body: JSON.stringify({ propertyId, teamId }),
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

export async function getTeams(companyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/listTeams.php?companyId=${companyId}`,
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

export async function getTeamMembers(companyId: string, teamId: string) {
	const url = `${import.meta.env.VITE_API_BASE_URL}/teams/listTeamMembers.php?companyId=${companyId}&teamId=${teamId}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function removeFromTeam(userId: string, teamId: string) {
	const url = `${import.meta.env.VITE_API_BASE_URL}/teams/removeFromTeam.php?userId=${userId}&teamId=${teamId}`;
	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function getTeamProperties(companyId: string, teamId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/listProperties.php?companyId=${companyId}&teamId=${teamId}`,
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

export async function getMyTeams(userId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/teams/getMyTeams.php?user_id=${userId}`,
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

export async function getProfile(userId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/user-management/getProfile.php?user_id=${userId}`,
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

export async function getAreas() {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/areas.php`,
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

export async function getQuestions(area: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/areaQuestions.php?area=${area}`,
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

export async function createCompliance(propertyId: string) {
	console.log('Creating compliance for property:', propertyId);
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/create.php`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ propertyId }),
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function getComplianceQuestionnaires(propertyId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/listQuestionnaires.php?propertyId=${propertyId}`,
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

export async function getComplianceQuestions(id: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/getComplianceQuestions.php?id=${id}`,
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

export async function saveAnswer(answer: Answer) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/saveAnswer.php`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(answer),
		}
	);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
}

export async function getComplianceAnswers(propertyComplianceId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/getAnswers.php?propertyComplianceId=${propertyComplianceId}`,
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
