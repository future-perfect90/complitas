type Company = {
    id: number;
	company_name: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	city: string;
	county: string;
	post_code: string;
	country: string;
	vat_no: string;
	company_reg_no: string;
	email: string;
	telephone: string;
};
type CompanyFormData = {
	company_name: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	city: string;
	county: string;
	post_code: string;
	country: string;
	vat_no: string;
	company_reg_no: string;
	email: string;
	telephone: string;
};

  // Type for validation errors.
  type ErrorsType = {
    company_name?: string;
    address_line_1?: string;
    address_line_2?: string;
    address_line_3?: string;
    city?: string;
    county?: string;
    post_code?: string;
    country?: string;
    vat_no?: string;
    company_reg_no?: string;
    email?: string;
    telephone?: string;
  };

export type { Company, CompanyFormData, ErrorsType };
