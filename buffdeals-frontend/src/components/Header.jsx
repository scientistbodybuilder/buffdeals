import React, { useState } from 'react'
import { FaGithub , FaLinkedin} from "react-icons/fa";
import { HashLink as Link } from "react-router-hash-link";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [selected, setSelected] = useState('Search')
    const navigate = useNavigate()
    const { session, signOut } = UserAuth()

    // const handleSignOut = async (e) => {
    //     e.preventDefault()
    //     try {
    //         await signOut()
    //         navigate('/')
    //     } catch(e) {
    //         console.error(`Error on signout: ${e}`)
    //     }
    // }

    return(
        <nav className='w-full px-10 mx-auto bg-[#40A9EA] h-16 flex left-0 top-0 right-0 z-100 fixed items-center justify-between border-b-3 border-[#4a90bc]'>
            <h2 className='md:text-2xl text-xl text-white font-sans font-bold'>Buff Deals</h2>

            
            <ul className='items-center flex justify-evenly gap-5'>
                <li className='md:flex hidden'>
                    <a href='https://github.com/scientistbodybuilder?tab=repositories' target='_blank' aria-label='Github'>
                    <FaGithub size={34} color='white'/>
                    </a>
                </li>
                <li className='md:flex hidden'>
                    <a href='https://www.linkedin.com/in/ousman-jikineh/' target='_blank' aria-label='Linkedin'>
                    <FaLinkedin size={34} color='white'/>
                    </a>
                </li>
            </ul>


        </nav>
    )
}


export default Header

