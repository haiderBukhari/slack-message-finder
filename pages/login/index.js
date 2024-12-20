import axios from 'axios';
import React from 'react'

const index = () => {

    const authenticateUser = async () => {
        const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slack/connect`, {
            headers: {
                "Accept": "application/json",
            }
        })

        if(data.data.authUrl){
            window.location.href = data.data.authUrl;
        }else{
            alert("Authentication URL not found.");
        }
    }

    return (
        <div className="flex justify-center items-center" >
            <div className="mx-auto container flex h-screen w-full flex-col mt-20 rounded-md" >
                <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px] rounded-md py-3 px-4">
                    <div className="m-auto flex flex-col space-y-2 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-6 w-6"
                        />
                        <h1 className="text-4xl text-gray-800 font-extrabold pb-3 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                        Connect your Slack workspace to seamlessly search and retrieve messages. Gain quick access to conversations across channels and DMs
                        </p>
                    </div>

                    <div className="grid text-white text-bold text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-5 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 hover:ring ring-transparent ring-offset-2 transition rounded-md">
                        <button
                            onClick={authenticateUser}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 pr-6"
                        >
                            <svg className="h-4 w-4 " /> Connect Slack
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default index
