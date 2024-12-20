'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation'

const SlackOAuthRedirect = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Loading...');
    const searchParams = useSearchParams()
    const router = useRouter()
 
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    useEffect(() => {
        const sendCodeToBackend = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slack/oauth/verify?code=${code}&state=${state}`);
                localStorage.setItem('authorization', response.data.signedToken);
                setMessage('Authorization successfull!');
                router.push('/dashboard')
            } catch (error) {
                console.log(error)
                setMessage('Authorization failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (code && state) {
            sendCodeToBackend();
        }
    }, [code, state]); 

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>{message}</h1>
            {loading && <p>Please wait while we process your request...</p>}
        </div>
    );
};

export default SlackOAuthRedirect;
