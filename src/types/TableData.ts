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
	isNewlyAdded?: boolean; // 标识是否为新增的记录
}
export interface ProcessedData {
	dt: string;
	validHours: number;
	beInDebtHours: number;
	empName: string;
	checkInTime: string;
	checkOutTime: string;
	isShowCheckInEdit: boolean;
	isShowCheckOutEdit: boolean;
	isNewlyAdded?: boolean; // 标识是否为新增的行
}
