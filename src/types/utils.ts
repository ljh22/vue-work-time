import type { TableData, ProcessedData } from '@/types/TableData';

export interface Utils {
	/**
	 * 判断选择月份是否超过当前月份
	 * @param selectMonth 选择月份
	 * @returns boolean 如果选择的月份大于当前月份，则返回true
	 * @description 如果选择的月份大于当前月份，则返回true并显示警告消息
	 */
	isMonthExceed: (selectMonth: Date) => boolean;
	/**
	 * 更新CSS自定义属性以改变主题色，并生成各种变体颜色
	 * @param newColor 新的主题色
	 * @description 更新CSS自定义属性以改变主题色，并生成各种变体颜色
	 */
	updateThemeColor: (newColor: string) => void;
	/**
	 * 初步处理表格数据，把表格中相同日期的打卡记录合并为一条记录
	 * 上班时间为8-12 13:30-17:30，早上弹性时间到9点
	 * 工作日下午的17:30到18:00之间不算时间
	 * @param tableData 表格数据
	 * @returns 处理后的数据
	 */
	firstProcessingTableData: (tableData: TableData[], CalculationMethodType: number) => ProcessedData[];
	/**
	 * 添加指定日期的打卡记录
	 * @param date 指定日期
	 * @param tableData 表格数据
	 * @returns
	 */
	addDate: (date: Date, tableData: TableData[]) => ProcessedData[];
	/**
	 * 获取组件根DOM的方法
	 * @param compRef  组件引用
	 * @returns  组件根DOM元素
	 */
	getComponentRoot: (compRef: any) => HTMLElement | null;
	/**
	 * 检查插件版本是否需要更新
	 * @returns { needUpdate: boolean; currentVersion: string }
	 */
	checkVersionUpdate: () => {
		needUpdate: boolean;
		currentVersion: string;
	};
	/**
	 * 获取当前版本号
	 * @returns 当前版本号
	 */
	getCurrentVersion: () => string;
	/**
	 * 确认版本
	 * @param version 版本号
	 */
	confirmVersion: (version: string) => void;
	/**
	 * 获取图标组件
	 * @param name 图标名称
	 * @returns 图标组件
	 */
	getIcon: (name: string) => any;
}
