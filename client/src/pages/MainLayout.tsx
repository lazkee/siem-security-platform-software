import { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Dashboard from '../components/views/Dashboard';
import Events from '../components/views/Events';
import Statistics from '../components/views/Statistics';
import Storage from '../components/views/Storage';
import Alert from '../components/views/Alerts';

export default function MainLayout() {
    const [sideMenuPage, setSideMenuPage] = useState<number>(0);

    return (
        <div className='flex fixed top-10 left-0 right-5 bottom-10 gap-4'>
            <Sidebar setSideMenuPage={setSideMenuPage} />

            <div className='flex-1 p-4 bg-[#202020] h-full overflow-y-scroll'>
                {sideMenuPage === 0 && <Dashboard />}
                {sideMenuPage === 1 && <Events />}
                {sideMenuPage === 2 && <Statistics />}
                {sideMenuPage === 3 && <Storage />}
                {sideMenuPage === 4 && <Alert />}
            </div>
        </div>
    );
}
