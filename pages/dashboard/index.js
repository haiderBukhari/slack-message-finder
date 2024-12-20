'use client'

import { Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AlertDialogSlide from '../../components/dialog'
import { useRouter } from 'next/navigation'

const Index = () => {
    const [message, setMessage] = useState('')
    const [existingMessages, setExistingMessages] = useState([])
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('authorization')) {
            router.push('/') 
        }
    }, [router])

    const handleSubmit = (e) => {
        e.preventDefault();
        setExistingMessages([...existingMessages, {
            role: 'user',
            message: message
        }])
        setOpen(true)
    }

    return (
        <div className='h-screen flex flex-col'>
            <header className="flex justify-end items-center px-6 py-4">
                <button onClick={() => {
                    localStorage.removeItem('authorization')
                    router.push('/')
                }} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
                    Logout
                </button>
            </header>

            <div className="flex-grow overflow-y-auto px-6 py-4">
                {!existingMessages.length ? (
                    <div className="flex min-h-[50vh] justify-center items-center">
                        <h1 className="text-3xl text-center font-medium text-gray-700">
                            Search Messages Demo
                        </h1>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {existingMessages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div 
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        msg.role === 'bot' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!existingMessages.length && (
                <div className='mx-5 px-3 w-[70%] bg-blue-50 py-2 rounded-md mb-4'>
                    <p>How can I help? You can ask me to find out your important messages without tedious effort. For example, you can ask me to find Haider's number.</p>
                </div>
            )}

            <div className="p-4">
                <form onSubmit={handleSubmit} className="relative w-full">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type message..."
                        className="w-full p-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-gray-700 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <Send />
                    </button>
                </form>
            </div>
            <AlertDialogSlide 
                open={open} 
                setOpen={setOpen} 
                message={message} 
                setExistingMessages={setExistingMessages} 
                existingMessages={existingMessages} 
                setMessage={setMessage}
            />
        </div>
    )
}

export default Index