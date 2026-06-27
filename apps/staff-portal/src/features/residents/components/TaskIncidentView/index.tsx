import { useState } from 'react';
import {

    ListTodo,

    AlertCircle,

} from 'lucide-react';

// Import the new component
import CareTaskView from './CareTaskView';
import IncidentView from './IncidentView';

const TaskIncidentView = ({residentId}: {residentId: string | null}) => {
    //const [filterType, setFilterType] = useState('ALL');
    const [activeSidebarTab, setActiveSidebarTab] = useState('tasks'); // Default to tasks

   

    const sidebarItems = [
        { id: 'tasks', label: 'Care Tasks', icon: <ListTodo className="w-4 h-4" />, count: 12 },
        { id: 'incidents', label: 'Incident Log', icon: <AlertCircle className="w-4 h-4" />, count: 2 },
    ];

    return (
        <div className="flex h-full animate-in fade-in duration-500 overflow-hidden">
            
            {/* =========================================
                SIDEBAR TOOL PANEL (Fixed)
                ========================================= */}
            <aside className="w-72 shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                        Navigation
                    </p>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSidebarTab(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                                    activeSidebarTab === item.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-[11px] font-black uppercase tracking-tight">{item.label}</span>
                                </div>
                                {item.count !== null && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                        activeSidebarTab === item.id ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                
            </aside>

            {/* =========================================
                MAIN CONTENT AREA
                ========================================= */}
            <div className="flex-1 flex flex-col min-w-0">
                

                {/* DYNAMIC VIEW CONTENT */}
                <div className="flex-1 overflow-hidden">
                    {activeSidebarTab === 'tasks' ? (
                        <CareTaskView residentId={residentId}/>
                    ) : activeSidebarTab === 'incidents' ? (<IncidentView />) : 
                    activeSidebarTab === 'insights' ?(
                        /* Standard Incident/History Ledger View */
                       <></>
                    ) : (<></>)}
                </div>
            </div>
        </div>
    );
};

export default TaskIncidentView;