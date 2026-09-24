import dayjs from 'dayjs';

interface HolidayDay {
	name: string;
	date: string;
	isOffDay: boolean;
}

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master';

const getCacheKey = (year: number) => `cnHolidays_${year}`;

const fetchHolidays = async (year: number): Promise<HolidayDay[]> => {
	// 优先读取缓存
	const cacheKey = getCacheKey(year);
	const cached = localStorage.getItem(cacheKey);
	if (cached) {
		try {
			return JSON.parse(cached) as HolidayDay[];
		} catch {
			localStorage.removeItem(cacheKey);
		}
	}

	// 请求在线数据
	try {
		const response = await fetch(`${CDN_BASE}/${year}.json`);
		if (!response.ok) throw new Error(`请求失败: ${response.status}`);
		const data = await response.json();
		const days: HolidayDay[] = data?.days ?? [];
		if (days.length > 0) {
			localStorage.setItem(cacheKey, JSON.stringify(days));
			return days;
		}
		throw new Error('未获取到节假日数据');
	} catch {
		// 网络请求失败时返回空数组，退化为仅跳过周末
		return [];
	}
};

/**
 * 获取指定年份的法定节假日映射
 * @param year 年份
 * @returns Map<日期(YYYY-MM-DD), isOffDay>
 */
export const getHolidayMap = async (year: number): Promise<Map<string, boolean>> => {
	const days = await fetchHolidays(year);
	const map = new Map<string, boolean>();
	days.forEach(day => map.set(day.date, day.isOffDay));
	return map;
};

/**
 * 判断某日期是否为工作日
 * - 法定节假日（isOffDay=true）为休息日
 * - 调休上班的周末（isOffDay=false）为工作日
 * - 普通工作日为工作日，普通周末为休息日
 */
export const isWorkday = (date: string, holidayMap: Map<string, boolean>): boolean => {
	const d = dayjs(date);
	const key = d.format('YYYY-MM-DD');
	if (holidayMap.has(key)) {
		return !holidayMap.get(key);
	}
	const dayOfWeek = d.day();
	return dayOfWeek !== 0 && dayOfWeek !== 6;
};
