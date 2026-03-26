export interface DistrictStat {
  id: string;
  name: string;
  center: [number, number]; // [lat, lng]
  total: number;
  pending: number;
  processing: number;
  resolved: number;
  general: number;
  bee: number;
  avgResponseMin: number;
}

export const districtStats: DistrictStat[] = [
  { id: 'banqiao',    name: '板橋區', center: [25.0152, 121.4628], total: 324, pending: 42, processing: 58, resolved: 224, general: 210, bee: 114, avgResponseMin: 14 },
  { id: 'sanchong',  name: '三重區', center: [25.0611, 121.4965], total: 218, pending: 31, processing: 44, resolved: 143, general: 152, bee: 66,  avgResponseMin: 17 },
  { id: 'zhonghe',   name: '中和區', center: [24.9985, 121.5025], total: 189, pending: 26, processing: 38, resolved: 125, general: 134, bee: 55,  avgResponseMin: 16 },
  { id: 'xinzhuang', name: '新莊區', center: [25.0334, 121.4470], total: 175, pending: 24, processing: 35, resolved: 116, general: 120, bee: 55,  avgResponseMin: 18 },
  { id: 'yonghe',    name: '永和區', center: [25.0107, 121.5154], total: 145, pending: 19, processing: 29, resolved: 97,  general: 98,  bee: 47,  avgResponseMin: 15 },
  { id: 'xindia',    name: '新店區', center: [24.9696, 121.5394], total: 132, pending: 18, processing: 27, resolved: 87,  general: 92,  bee: 40,  avgResponseMin: 19 },
  { id: 'tucheng',   name: '土城區', center: [24.9715, 121.4382], total: 118, pending: 16, processing: 24, resolved: 78,  general: 82,  bee: 36,  avgResponseMin: 21 },
  { id: 'xizhi',     name: '汐止區', center: [25.0653, 121.6521], total: 104, pending: 14, processing: 21, resolved: 69,  general: 76,  bee: 28,  avgResponseMin: 22 },
  { id: 'tamsui',    name: '淡水區', center: [25.1696, 121.4415], total: 97,  pending: 13, processing: 20, resolved: 64,  general: 71,  bee: 26,  avgResponseMin: 25 },
  { id: 'shulin',    name: '樹林區', center: [24.9934, 121.4166], total: 89,  pending: 12, processing: 18, resolved: 59,  general: 63,  bee: 26,  avgResponseMin: 20 },
  { id: 'luzhou',    name: '蘆洲區', center: [25.0911, 121.4731], total: 82,  pending: 11, processing: 17, resolved: 54,  general: 58,  bee: 24,  avgResponseMin: 16 },
  { id: 'sanxia',    name: '三峽區', center: [24.9344, 121.3691], total: 74,  pending: 10, processing: 15, resolved: 49,  general: 54,  bee: 20,  avgResponseMin: 28 },
  { id: 'linkou',    name: '林口區', center: [25.0712, 121.3654], total: 68,  pending: 9,  processing: 14, resolved: 45,  general: 49,  bee: 19,  avgResponseMin: 24 },
  { id: 'wugu',      name: '五股區', center: [25.0843, 121.4378], total: 61,  pending: 8,  processing: 12, resolved: 41,  general: 44,  bee: 17,  avgResponseMin: 19 },
  { id: 'taishan',   name: '泰山區', center: [25.0556, 121.4239], total: 54,  pending: 7,  processing: 11, resolved: 36,  general: 39,  bee: 15,  avgResponseMin: 22 },
  { id: 'bali',      name: '八里區', center: [25.1519, 121.3952], total: 47,  pending: 6,  processing: 10, resolved: 31,  general: 34,  bee: 13,  avgResponseMin: 27 },
  { id: 'yingge',    name: '鶯歌區', center: [24.9542, 121.3524], total: 43,  pending: 6,  processing: 9,  resolved: 28,  general: 31,  bee: 12,  avgResponseMin: 23 },
  { id: 'shenkeng',  name: '深坑區', center: [24.9986, 121.6124], total: 38,  pending: 5,  processing: 8,  resolved: 25,  general: 28,  bee: 10,  avgResponseMin: 30 },
  { id: 'pingxi',    name: '平溪區', center: [25.0198, 121.7354], total: 28,  pending: 4,  processing: 6,  resolved: 18,  general: 21,  bee: 7,   avgResponseMin: 35 },
  { id: 'shifen',    name: '石碇區', center: [24.9714, 121.6558], total: 25,  pending: 3,  processing: 5,  resolved: 17,  general: 19,  bee: 6,   avgResponseMin: 32 },
  { id: 'ruifang',   name: '瑞芳區', center: [25.1083, 121.8028], total: 22,  pending: 3,  processing: 4,  resolved: 15,  general: 17,  bee: 5,   avgResponseMin: 38 },
  { id: 'gongliao',  name: '貢寮區', center: [25.0223, 121.9074], total: 16,  pending: 2,  processing: 3,  resolved: 11,  general: 12,  bee: 4,   avgResponseMin: 42 },
  { id: 'shuangxi',  name: '雙溪區', center: [25.0333, 121.8611], total: 14,  pending: 2,  processing: 3,  resolved: 9,   general: 11,  bee: 3,   avgResponseMin: 45 },
  { id: 'wanli',     name: '萬里區', center: [25.1791, 121.6892], total: 19,  pending: 2,  processing: 4,  resolved: 13,  general: 14,  bee: 5,   avgResponseMin: 36 },
  { id: 'jinshan',   name: '金山區', center: [25.2151, 121.6399], total: 17,  pending: 2,  processing: 3,  resolved: 12,  general: 13,  bee: 4,   avgResponseMin: 39 },
  { id: 'shimen',    name: '石門區', center: [25.2904, 121.5736], total: 12,  pending: 1,  processing: 2,  resolved: 9,   general: 9,   bee: 3,   avgResponseMin: 44 },
  { id: 'sanzhi',    name: '三芝區', center: [25.2582, 121.5005], total: 15,  pending: 2,  processing: 3,  resolved: 10,  general: 11,  bee: 4,   avgResponseMin: 40 },
  { id: 'wulai',     name: '烏來區', center: [24.8687, 121.5504], total: 9,   pending: 1,  processing: 2,  resolved: 6,   general: 7,   bee: 2,   avgResponseMin: 48 },
  { id: 'xindian2',  name: '石碇區', center: [24.9714, 121.6558], total: 21,  pending: 3,  processing: 4,  resolved: 14,  general: 16,  bee: 5,   avgResponseMin: 31 },
];

// 月份趨勢假資料（近 12 個月）
export interface MonthlyTrend {
  date: string;
  general: number;
  bee: number;
  total: number;
}

export const monthlyTrend: MonthlyTrend[] = [
  { date: '2024/04', general: 142, bee: 38,  total: 180 },
  { date: '2024/05', general: 158, bee: 62,  total: 220 },
  { date: '2024/06', general: 171, bee: 89,  total: 260 },
  { date: '2024/07', general: 189, bee: 112, total: 301 },
  { date: '2024/08', general: 196, bee: 124, total: 320 },
  { date: '2024/09', general: 183, bee: 98,  total: 281 },
  { date: '2024/10', general: 165, bee: 71,  total: 236 },
  { date: '2024/11', general: 148, bee: 45,  total: 193 },
  { date: '2024/12', general: 132, bee: 32,  total: 164 },
  { date: '2025/01', general: 121, bee: 18,  total: 139 },
  { date: '2025/02', general: 134, bee: 24,  total: 158 },
  { date: '2025/03', general: 152, bee: 51,  total: 203 },
];

export function getDensityColor(total: number): string {
  if (total > 200) return '#ef4444'; // 紅
  if (total > 100) return '#f97316'; // 橘
  if (total > 50)  return '#f59e0b'; // 黃
  if (total > 20)  return '#22c55e'; // 綠
  return '#3b82f6';                  // 藍
}
