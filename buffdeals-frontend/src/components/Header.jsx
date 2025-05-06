import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    // faGithub,
    // faLinkedin,
    // faInstagram
    faHandshake,
  } from "@fortawesome/free-solid-svg-icons";




const Header = () => {
    return(
        <nav className='w-full px-10 mx-auto bg-[#49FCFC] h-24 flex left-0 top-0 right-0 z-100 fixed items-center justify-between'>
            <h2 className='text-5xl text-[#3C3C3C] font-sans font-bold'>BUFF DEALS</h2>
            <ul className='items-center flex justify-evenly gap-5'>
                <li>
                    <a href='https://github.com/scientistbodybuilder?tab=repositories' target='_blank' className='text-xl font-semibold text-[#3C3C3C]'>
                        {/* <FontAwesomeIcon icon={faGithub} /> */}
                        Github
                    </a>
                </li>


                <li>
                    <a href='https://www.linkedin.com/in/ousman-jikineh/' target='_blank' className='text-xl font-semibold text-[#3C3C3C]'>
                        {/* <FontAwesomeIcon icon={faLinkedin} /> */}
                        Linkedin
                    </a>
                </li>


                <li>
                    <a href='https://www.instagram.com/ousmanjikineh/' target='_blank' className='text-xl font-semibold text-[#3C3C3C]'>
                        {/* <FontAwesomeIcon icon={faInstagram} /> */}
                        Instagram
                    </a>
                </li>


            </ul>


        </nav>
    )
}


export default Header

