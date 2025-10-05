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
	occupancyType?: string;
	habitableHeight?: number;
	buildingHeight?: number;
	designDate?: string;
	lifts?: boolean | 1 | 0;
	communalUtilityAssets?: boolean | 1 | 0;
	communalGasAppliances?: boolean | 1 | 0;
	meterBank?: boolean | 1 | 0;
	voidAssets?: boolean | 1 | 0;
	residentalFlats?: number;
	uniqueSupplyPoints?: number;
	commercialUnits?: number;
	wellMaintained?: boolean | 1 | 0;
	mitigationPlan?: string;
	refurbished?: boolean | 1 | 0;
	refurbishedCDM?: string;
	managerEmail?: string;
	managerTelephone?: string;
	managerAddress?: string;
	siteEmail?: string;
	siteTelephone?: string;
	emergencyName?: string;
	emergencyEmail?: string;
	emergencyTelephone?: string;
	emergencyAddress?: string;
	localFireName?: string;
	localFireEmail?: string;
	localFireTelephone?: string;
	localFireAddress?: string;
	localFireDetails?: string;
	carpark?: boolean | 1 | 0;
	uniqueReferenceNumber?: string;
	residentialAwareness?: string;
	logBook?: boolean | 1 | 0;
	fireSafetyLogBook?: boolean | 1 | 0;
	electronicAuditCompleted?: boolean | 1 | 0;
	epc?: boolean | 1 | 0;
	energyCertificates?: boolean | 1 | 0;
	isolationValvesClear?: boolean | 1 | 0;
	accessControlled?: boolean | 1 | 0;
	oms?: boolean | 1 | 0;
}
export interface User {
	id?: string;
	name: string;
	email: string;
	password: string;
	company?: string;
}

export interface Team {
	id?: string;
	name: string;
	companyId: string;
}

export interface ProfileData {
	profile: {
		id?: string;
		name?: string;
		email?: string;
	};
	teams: {
		id?: string;
		name?: string;
	}[];
	properties: {
		id?: string;
		name?: string;
	}[];
}

export interface MaintenanceTask {
	id?: string;
	title: string;
	description: string;
	typeOfWork: string;
	evidence?: string;
	completedAt?: string;
	completedBy?: string;
	propertyId: string;
	createdAt?: string;
	name?: string;
	contactName?: string;
	contactAddress?: string;
	contactNumber?: string;
}

export interface NotificationPreferences {
	id?: string;
	daysBeforeExpiry: number;
	isActive: 1 | 0;
}
