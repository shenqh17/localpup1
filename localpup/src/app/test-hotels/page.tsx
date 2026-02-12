'use client'

import { hotels } from '@/data/hotels100'

export default function TestHotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">酒店数据测试页面</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">数据统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">总酒店数量</p>
              <p className="text-3xl font-bold text-blue-700">{hotels.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">平均价格</p>
              <p className="text-3xl font-bold text-green-700">
                ¥{Math.round(hotels.reduce((sum, hotel) => sum + hotel.price, 0) / hotels.length)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">平均评分</p>
              <p className="text-3xl font-bold text-purple-700">
                {Math.round((hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length) * 10) / 10}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">前20家酒店列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">中文名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评分</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">位置</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotels.slice(0, 20).map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{hotel.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{hotel.nameZh || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">¥{hotel.price}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{hotel.rating}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{hotel.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            显示 {Math.min(20, hotels.length)} / {hotels.length} 家酒店
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">诊断信息</h3>
          <ul className="list-disc pl-5 text-yellow-700">
            <li>数据文件: hotels100.ts</li>
            <li>导出变量: hotels</li>
            <li>实际数量: {hotels.length} 家酒店</li>
            <li>如果这里显示100，但主页面显示15，说明是页面逻辑问题</li>
            <li>如果这里也显示15，说明是数据导入问题</li>
          </ul>
        </div>
      </div>
    </div>
  )
}