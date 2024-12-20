'use client'

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { X, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function ImprovedSlackSearch({ open, setOpen, message, existingMessages, setExistingMessages, setMessage }) {
    const [keywords, setKeywords] = React.useState([]);
    const [channels, setChannels] = React.useState([]);
    const [selectedChannel, setSelectedChannel] = React.useState(null);
    const [newKeyword, setNewKeyword] = React.useState('');
    const [isChannelDropdownOpen, setIsChannelDropdownOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!open) return;

        // Fetch keywords using Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMENI_API_KEY}`;

        const data = {
            contents: [{
                parts: [{ text: `Extract meaningful keywords from the given sentence. The keywords should be relevant objects or concepts, consisting of one or two words. Avoid any question formats or unnecessary words and ensure the keywords generated are comma seperated and nothing else. Focus on clarity and significance in the context of the sentence. here is sentence ${message}` }]
            }]
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                setKeywords(data.candidates[0].content.parts[0].text.trim().split(', '));
            })

        // Fetch channels
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch-channels`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('authorization')}`
            }
        })
            .then(res => res.json())
            .then(data => setChannels(data))
            .catch(error => console.error('Error fetching channels:', error));
    }, [open, message]);

    const handleClose = () => {
        setKeywords([]);
        setChannels([]);
        setMessage('')
        setSelectedChannel(null);
        setLoading(false)
        setOpen(false);
    };

    const handleAddKeyword = () => {
        if (newKeyword && !keywords.includes(newKeyword)) {
            setKeywords([...keywords, newKeyword]);
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const handleSearch = async () => {
        if (!selectedChannel || !selectedChannel?.name) {
            alert('Please Select Channel')
            return;
        }
        setLoading(true)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search-message`, {
            query: keywords,
            channelId: selectedChannel.name
        }, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('authorization')}`
            }
        }).then((res) => {
            if (!res.data.messages.length) {
                setMessage('')
                setExistingMessages([...existingMessages, {
                    role: 'system',
                    message: "Unable to find the specified slack message!"
                }])
            }
            else {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMENI_API_KEY}`;

                const messagesArray = res.data.messages.map(msg => `Time: ${msg.ts} - Message: ${msg.text}`).join('\n');


                const data = {
                    contents: [{
                        parts: [
                            {
                                text: `"I have provided a list of messages related to the query: "${message}" These messages are in ascending order based on their timestamp:

${messagesArray}
Please carefully analyze the provided list and determine if any message is semantically related to the query: "${message}"

If you find a semantically related message, respond with the closest matching message in a simple string format. Do not rely on length-based similarity; match the query to the messages based on their meaning and context.

If no message is semantically related, respond only with "Can't find.""

`
                            }
                        ]
                    }]
                };



                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(data => {
                        setMessage('')
                        handleClose();

                        setExistingMessages([...existingMessages, {
                            role: 'bot',
                            message: data.candidates[0].content.parts[0].text.trim()
                        }]);
                    })
            }
        })
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle className="text-2xl font-bold">Search Slack Messages</DialogTitle>
            <DialogContent>
                <div className="space-y-4 mt-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                                    {keyword}
                                    <button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 text-blue-600 hover:text-blue-800">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                placeholder="Add a keyword"
                                className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddKeyword}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className={`${isChannelDropdownOpen && 'pb-40'}`}>
                        <h3 className="text-lg font-semibold ">Select Channel</h3>
                        <div className="relative">
                            <button
                                onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                                className="w-full text-left bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                            >
                                {selectedChannel ? selectedChannel.name : 'Select a channel'}
                                <ChevronDown size={20} />
                            </button>
                            {isChannelDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {channels.map((channel) => (
                                        <button
                                            key={channel.id}
                                            onClick={() => {
                                                setSelectedChannel(channel);
                                                setIsChannelDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                        >
                                            {channel.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

