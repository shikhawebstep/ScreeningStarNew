import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from "recharts";
import DataTable from "./innerpages/MasterTable";
const data = [
  { name: "INSUFFICIENCY", value: 0 },
  { name: "COMPLETED GREEN", value: 0 },
  { name: "COMPLETED RED", value: 0.5 },
  { name: "COMPLETED YELLOW", value: 0.2 },
  { name: "COMPLETED PINK", value: 0.4 },
  { name: "COMPLETED ORANGE", value: 0.8 },
  { name: "REPORTS IN TAT", value: 1.6 },
  { name: "REPORTS OUT OF TAT", value: 1.8 },
  { name: "CASE RECEIVED", value: 2.0 },
];

const CustomDot = (props) => {
  const { cx, cy, stroke, index } = props;
  const colors = ["purple", "green", "red", "yellow", "pink", "orange", "cyan", "blue", "lightblue"];
  return (
    <Dot cx={cx} cy={cy} r={5} fill={colors[index]} strokeWidth={2} stroke={stroke} />
  );
};
const MasterDashboard = () => {
  return (
    <div className="bg-[#c1dff2]">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">MASTER DASHBOARD</h2>
      <div className="bg-white p-12  w-full mx-auto">
        <div className='text-center'>
          <input type="month" className='mb-[20px] p-3 px-12 text-2xl bg-gray-300 text-center border-2 rounded' />
        </div>
        <div className='text-center'>
        <div class="flex text-left pr-0 flex-wrap gap-4 p-4 bg-white">
            <div class="flex items-center justify-between w-[32%] p-4 bg-blue-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-blue-800">CASE RECEIVED</p>
                <span class="text-xl font-bold text-blue-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-blue-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-yellow-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-yellow-800">INSUFFICIENCY</p>
                <span class="text-xl font-bold text-yellow-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-yellow-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-green-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-green-800">COMPLETED</p>
                <span class="text-xl font-bold text-green-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-clipboard-list text-2xl text-green-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-orange-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-orange-800">WIP</p>
                <span class="text-xl font-bold text-orange-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-comments text-2xl text-orange-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bbg-green-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-green-800">COMPLETED GREEN</p>
                <span class="text-xl font-bold text-green-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-green-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-red-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-red-800">COMPLETED RED</p>
                <span class="text-xl font-bold text-red-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-red-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-pink-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-pink-800">COMPLETED YELLOW</p>
                <span class="text-xl font-bold text-pink-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-pink-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-teal-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-teal-800">COMPLETED PINK</p>
                <span class="text-xl font-bold text-teal-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-teal-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-indigo-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-indigo-800">COMPLETED ORANGE</p>
                <span class="text-xl font-bold text-indigo-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-indigo-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-gray-200 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-gray-800">REPORTS IN TAT</p>
                <span class="text-xl font-bold text-gray-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-gray-600"></i>
              </div>
            </div>

            <div class="flex items-center justify-between w-[32%] p-4 bg-gray-300 rounded shadow">
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-gray-800">REPORTS OUT OF TAT</p>
                <span class="text-xl font-bold text-gray-800">0</span>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign text-2xl text-gray-600"></i>
              </div>
            </div>
          </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          fillOpacity={0.5}
          fill="url(#colorUv)"
          dot={<CustomDot />}
        />
      </LineChart>
    </ResponsiveContainer>
      </div>
<div>
  <DataTable/>
</div>
    </div>
  )
}

export default MasterDashboard
