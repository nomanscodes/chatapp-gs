import React from 'react'
import SIdebar from '../components/SIdebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useState } from 'react'

const HomePage = () => {

    const [selectedUser, setSelectedUser] = useState(false);

    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
                <SIdebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                {
                    selectedUser && <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                }
            </div>
        </div>
    )
}

export default HomePage