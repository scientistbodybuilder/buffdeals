import React, { useState } from 'react'
import { FaGithub , FaLinkedin} from "react-icons/fa";
import { HashLink as Link } from "react-router-hash-link";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [selected, setSelected] = useState('Search')
    const navigate = useNavigate()
    const { session, signOut } = UserAuth()

    const handleSignOut = async (e) => {
        e.preventDefault()
        try {
            await signOut()
            navigate('/')
        } catch(e) {
            console.log(`Error on signout: ${e}`)
        }
    }

    return(
        <nav className='w-full px-10 mx-auto bg-[#40A9EA] h-20 flex left-0 top-0 right-0 z-100 fixed items-center justify-between'>
            <h2 className='md:text-2xl text-xl text-white font-sans font-bold'>Buff Deals</h2>
            {/* <ul className='items-center flex justify-evenly gap-5'>
                <li className={`md:text-2xl font-medium cursor-pointer text-base ${selected === 'Search' ? '' : ''}`}>
                    <Link to={"/"} onClick={()=>setSelected('Search')}>
                    Search
                    </Link>
                    </li>
                <li className={`md:text-2xl font-medium cursor-pointer text-base ${selected === 'Dashboard' ? '' : ''}`}>
                    <Link to={"/dashboard"} onClick={()=>setSelected('Dashboard')}>
                    Dashboard
                    </Link>
                    </li>
            </ul> */}

            
            <ul className='items-center flex justify-evenly gap-5'>
                <li className='md:flex hidden'>
                    <a href='https://github.com/scientistbodybuilder?tab=repositories' target='_blank' aria-label='Github'>
                    <FaGithub size={35} color='white'/>
                    </a>
                </li>


                <li className='md:flex hidden'>
                    <a href='https://www.linkedin.com/in/ousman-jikineh/' target='_blank' aria-label='Linkedin'>
                    <FaLinkedin size={35} color='white'/>
                    </a>
                </li>


                {/* <li className='md:flex hidden'>
                    <a href='https://www.instagram.com/ousmanjikineh/' target='_blank' aria-label='Instagram'>
                    <FaInstagram size={45}/>
                    </a>
                </li>
                <li className='md:text-xl text-base font-medium cursor-pointer'>
                    {
                        session ? (
                            <p onClick={handleSignOut}>Sign out</p>
                        ) : (
                            <Link to={"/login"} >
                                Sign in
                            </Link>
                        )
                    }
                    
                </li> */}


            </ul>


        </nav>
    )
}


export default Header

