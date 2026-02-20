import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Users, BookOpen, GraduationCap, Search, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import rawData from './data.json';

export default function App() {
  // --- 1. STATE MANAGEMENT ---
  const [role, setRole] = useState('HOD'); 
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // --- 2. DATA CALCULATIONS ---
  const filteredData = useMemo(() => {
    return rawData.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Statistics for the top cards
  const classAvg = (rawData.reduce((acc, s) => acc + (s.Math + s.Science + s.English) / 3, 0) / rawData.length).toFixed(1);
  const atRisk = rawData.filter(s => (s.Math + s.Science + s.English) / 3 < 50).length;

  // Pagination Logic
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-indigo-950">Class Analytics.</h1>
            <p className="text-slate-500 font-medium text-lg">Performance Monitoring System</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search student records..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white shadow-sm transition-all text-lg"
              onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </header>

        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><TrendingUp size={28}/></div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Overall Average</p>
              <p className="text-3xl font-black text-slate-800">{classAvg}%</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-600"><AlertCircle size={28}/></div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">At-Risk Students</p>
              <p className="text-3xl font-black text-slate-800">{atRisk}</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-1 mb-8 bg-slate-200/40 p-1.5 rounded-2xl w-fit">
          <TabBtn active={role === 'HOD'} onClick={() => setRole('HOD')} icon={<Users size={18}/>} label="HOD View" />
          <TabBtn active={role === 'Faculty'} onClick={() => setRole('Faculty')} icon={<BookOpen size={18}/>} label="Faculty View" />
          <TabBtn active={role === 'Student'} onClick={() => setRole('Student')} icon={<GraduationCap size={18}/>} label="Student Personal" />
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-100 min-h-[500px]">
          {role === 'HOD' && <HODView data={rawData} />}
          {role === 'Faculty' && (
            <FacultyView 
              data={currentRecords} 
              currentPage={currentPage} 
              npage={npage} 
              setCurrentPage={setCurrentPage} 
            />
          )}
          {role === 'Student' && <StudentView data={rawData[0]} />}
        </main>

        <footer className="mt-10 text-center text-slate-400 text-sm font-medium">
          Krishna Priya • University Analytics Portal 2026
        </footer>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
    >
      {icon} {label}
    </button>
  );
}

function HODView({ data }) {
  const chartData = [
    { name: 'Math', avg: 82 }, { name: 'Science', avg: 74 }, { name: 'English', avg: 88 }
  ];

  return (
    <div className="h-full">
      <div className="mb-10">
        <h3 className="text-2xl font-black text-slate-800">Department Performance</h3>
        <p className="text-slate-500 font-medium">Class averages per subject area</p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}} 
              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800}}
            />
            <Bar dataKey="avg" radius={[10, 10, 0, 0]} barSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.avg < 75 ? '#f43f5e' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FacultyView({ data, currentPage, npage, setCurrentPage }) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800">Student Grading Table</h3>
        <p className="text-slate-500 font-medium">Real-time filter results</p>
      </div>
      <div className="overflow-x-auto grow">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 font-black">
              <th className="pb-6">Student Name</th>
              <th className="pb-6 text-center">Math</th>
              <th className="pb-6 text-center">Science</th>
              <th className="pb-6 text-center">English</th>
              <th className="pb-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map(s => (
              <tr key={s.id} className="group hover:bg-slate-50/60 transition-colors">
                <td className="py-6 font-bold text-slate-700">{s.name}</td>
                <td className="py-6 text-center font-semibold">{s.Math}</td>
                <td className="py-6 text-center font-semibold">{s.Science}</td>
                <td className="py-6 text-center font-semibold">{s.English}</td>
                <td className="py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${s.Math > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {s.Math > 50 ? 'PASSED' : 'RETAKE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Page {currentPage} of {npage}</p>
        <div className="flex gap-4">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p-1)} 
            className="p-3 border rounded-2xl hover:bg-slate-50 disabled:opacity-20 shadow-sm"
          ><ChevronLeft size={20}/></button>
          <button 
            disabled={currentPage === npage} 
            onClick={() => setCurrentPage(p => p+1)} 
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-20 shadow-lg shadow-indigo-200"
          ><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
  );
}

function StudentView({ data }) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-32 h-32 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-200 mb-8">
        {data.name.charAt(0)}
      </div>
      <h2 className="text-4xl font-black text-slate-800 mb-2">{data.name}</h2>
      <p className="text-slate-400 font-bold tracking-widest mb-12">REGISTRATION: {data.id}</p>
      
      <div className="grid grid-cols-3 gap-16 w-full max-w-2xl px-6 py-10 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
        <div className="text-center"><p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] mb-3">Math</p><p className="text-4xl font-black text-indigo-600">{data.Math}</p></div>
        <div className="text-center"><p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] mb-3">Science</p><p className="text-4xl font-black text-indigo-600">{data.Science}</p></div>
        <div className="text-center"><p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] mb-3">English</p><p className="text-4xl font-black text-indigo-600">{data.English}</p></div>
      </div>
    </div>
  );
}
