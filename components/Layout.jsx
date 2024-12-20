'use client'
import Head from "next/head"
import Navbar from "./ui/Navbar"
import { usePathname } from 'next/navigation'

const Layout = ({ children }) => {
    const pathname = usePathname()
    return (
        <>
            <Head>
                <title>Designfast - Figma Design Kit</title>
                <meta name='description' content='Accelerate your next design project with premium UI kit to get you started. Be a pro at designing interfaces that convert.' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            { !pathname.includes('dashboard') && <Navbar /> }
            <main>{children}</main>
            {/* <Footer /> */}
        </>
    )
}

export default Layout