import React, { useState } from 'react'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { HashLink as Link } from "react-router-hash-link";


const Header = () => {
    const [selected, setSelected] = useState('Search')
    return(
        <nav className='w-full px-10 mx-auto bg-[#49FCFC] h-24 flex left-0 top-0 right-0 z-100 fixed items-center justify-between'>
            <h2 className='md:text-5xl text-3xl text-black font-sans font-bold'>BUFF DEALS</h2>
            <ul className='items-center flex justify-evenly gap-5'>
                <li className={`md:text-2xl font-bold cursor-pointer text-base ${selected === 'Search' ? '' : ''}`}>
                    <Link to={"/"} onClick={()=>setSelected('Search')}>
                    Search
                    </Link>
                    </li>
                <li className={`md:text-2xl font-bold cursor-pointer text-base ${selected === 'Dashboard' ? '' : ''}`}>
                    <Link to={"/catalog"} onClick={()=>setSelected('Dashboard')}>
                    Dashboard
                    </Link>
                    </li>
            </ul>
            <ul className='md:items-center md:flex md:justify-evenly md:gap-5 hidden'>
                <li>
                    <a href='https://github.com/scientistbodybuilder?tab=repositories' target='_blank' aria-label='Github'>
                    <FaGithub size={45}/>
                    </a>
                </li>


                <li>
                    <a href='https://www.linkedin.com/in/ousman-jikineh/' target='_blank' aria-label='Linkedin'>
                    <FaLinkedin size={45}/>
                    </a>
                </li>


                <li>
                    <a href='https://www.instagram.com/ousmanjikineh/' target='_blank' aria-label='Instagram'>
                    <FaInstagram size={45}/>
                    </a>
                </li>


            </ul>


        </nav>
    )
}


export default Header

