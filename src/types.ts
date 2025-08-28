export interface Company {
	id?: string;
	name: string;
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	county: string;
	country: string;
	postCode: string;
	vatNo: string;
	companyRegNo: string;
	telephone: string;
	email: string;
	logo: string;
}

export interface Property {
	id?: string;
	name: string;
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	county: string;
	country: string;
	postCode: string;
	managerName: string;
	telephone: string;
	email: string;
}
export interface User {
	id?: string;
	name: string;
	email: string;
	password: string;
}

export interface Team {
	id?: string;
	name: string;
	companyId: string;
}
