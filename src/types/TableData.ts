export interface TableData {
	dt: string;
	checktime?: string;
	checkInTime?: string;
	checkOutTime?: string;
	type: string;
	empId?: string;
	deptName?: string;
	emp_code?: string;
	locsetname?: string;
	empCode?: string;
	empName: string;
}
export interface ProcessedData {
	dt: string;
	empName: string;
	checkInTime: string;
	checkOutTime: string;
}
