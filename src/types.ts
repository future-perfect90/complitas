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
	lifts?: boolean;
	communalUtilityAssets?: boolean;
	communalGasAppliances?: boolean;
	meterBank?: boolean;
	voidAssets?: boolean;
	residentalFlats?: number;
	uniqueSupplyPoints?: number;
	commercialUnits?: number;
	wellMaintained?: boolean;
	mitigationPlan?: string;
	refurbished?: boolean;
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
	carpark?: boolean;
	uniqueReferenceNumber?: string;
	residentialAwareness?: string;
	logBook?: boolean;
	fireSafetyLogBook?: boolean;
	electronicAuditCompleted?: boolean;
	epc?: boolean;
	energyCertificates?: boolean;
	isolationValvesClear?: boolean;
	accessControlled?: boolean;
	oms?: boolean;
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
