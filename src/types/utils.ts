import type { TableData, ProcessedData } from '@/types/TableData';

export interface Utils {
	isMonthExceed: (selectMonth: Date) => boolean;
	updateThemeColor: (newColor: string) => void;
	firstProcessingTableData: (tableData: TableData[], CalculationMethodType: number) => ProcessedData[];
}
