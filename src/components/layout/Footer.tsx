import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-800 text-slate-300 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">新北市政府動物保護防疫處</h3>
                        <p className="text-sm">地址：220 新北市板橋區四川路一段157巷2號</p>
                        <p className="text-sm">電話：(02) 2959-6353</p>
                        <p className="text-sm">傳真：(02) 2959-6351</p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">快速連結</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/faq" className="hover:text-white">常見問答 (QA)</Link></li>
                            <li><Link to="/news" className="hover:text-white">動物收容公告</Link></li>
                            <li><Link to="/resources" className="hover:text-white">動保法規查詢</Link></li>
                            <li><Link to="/smart-guide" className="hover:text-white">案件通報引導</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">緊急聯絡</h3>
                        <div className="bg-alert-600 text-white p-4 rounded-lg text-center font-bold">
                            24小時動保專線 <br />
                            <span className="text-2xl">1959</span>
                        </div>
                        <p className="text-xs mt-2 text-center text-slate-400">市民專線 1999 (新北市境內由 1999 受理)</p>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-8 pt-8 text-center text-xs">
                    <p>&copy; 2026 新北市政府動物保護防疫處 版權所有</p>
                </div>
            </div>
        </footer>
    );
};
