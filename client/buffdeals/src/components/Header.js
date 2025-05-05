import React from 'react'
import '../styles/header.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faLinkedin,
    faInstagram
  } from "@fortawesome/free-solid-svg-icons";


const Header = () => {
    return(
        <nav>
            <h2>BuffDeals</h2>
            <ul className='socials'>
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