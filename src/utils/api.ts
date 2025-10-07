import type { MultiValue } from 'react-select';
import type { Company, Property, User } from '../types';
import authService from './authService';

export interface Answer {
	questionId: string;
	reportId: string;
	propertyId: string;
	answer: 'Yes' | 'No' | 'NA' | null;
	fileUrl?: string;
	fileName?: string;
}

// Update a section of property data by key-value array

export async function updatePropertySection(
	id: string,
	data: Record<string, any>
) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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

export async function getCompanies() {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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

export async function createCompliance(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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

export async function getComplianceReports(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/listReports.php?propertyId=${propertyId}`,
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

export async function getComplianceQuestions(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/compliance/getComplianceQuestions.php?propertyId=${propertyId}`,
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
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

export async function getReportData(reportId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/document/getReportData.php?reportId=${reportId}`,
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

export async function getMaintenanceTasksReportData(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/document/getMaintenanceTasksReportData.php?propertyId=${propertyId}`,
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

export async function changePassword(userId: string, password: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const url = `${import.meta.env.VITE_API_BASE_URL}/user-management/changePassword.php`;
	return fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, password }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => {
			throw error;
		});
}

export async function getMaintenanceTasks(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/maintenance/list.php?propertyId=${propertyId}`,
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

export async function createMaintenanceTask(payload: any) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/maintenance/create.php`,
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

export async function completeMaintenanceTask(payload: any, id: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/maintenance/complete.php`,
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
	return response.json();
}

export async function getPreferences(propertyId: string) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/notificationPreferences/list.php?propertyId=${propertyId}`,
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

export async function updateNotificationPreferences(
	propertyId: string,
	days: number[]
) {
	const jwt =
		authService.getAccessTokenSilently ?
			await authService.getAccessTokenSilently()
		:	'';
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/notificationPreferences/update.php`,
		{
			method: 'POST',
			body: JSON.stringify({ propertyId, days }),
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
	return response.ok;
}
