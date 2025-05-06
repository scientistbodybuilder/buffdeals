import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faLinkedin,
    faInstagram
  } from "@fortawesome/free-solid-svg-icons";




const Header = () => {
    return(
        <nav className='container bg-teal-400 .h-16 .flex .left-0 .top-0 .right-0 .z-100 .fixed .items-center .justify-between'>
            <h2 className='.text-3xl .text-black .font-sans'>BuffDeals</h2>
            <ul className='.items-center .flex .justify-evenly'>
                <li>
                    <a href='' target='_blank'>
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </li>


                <li>
                    <a href='' target='_blank'>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                </li>


                <li>
                    <a href='' target='_blank'>
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </li>


            </ul>


        </nav>
    )
}


export default Header

