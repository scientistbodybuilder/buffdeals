import React, {useState, useEffect} from 'react'
import { HashLink as Link } from 'react-router-hash-link'

const Signup = () => {
    const [formData, setFormData] = useState({
                'email':'',
                'password':'',
            })
    
        const Submit = () => {
            console.log('press login')
        }
    
        const handleChange = (e) => {
            setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            }));
            console.log(`new form data: ${formData['email']}`)
        };
        return(
            <section className='flex flex-col items-center justify-center w-full px-10 mb-5 h-screen bg-[#49FCFC]'>
                <form className='mx-auto w-100 flex flex-col justify-center items-center border border-gray-300 py-15 px-4 rounded-md bg-[#fff]' onSubmit={Submit}>
                    <h2 className='mb-20 font-semibold text-2xl'>BUFF DEALS</h2>
    
    
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min_price'>Email</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='supplement' name='supplement' type='text' required onChange={handleChange}/>
                    </div>
                    
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min_price'>Password</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='supplement' name='supplement' type='text' required onChange={handleChange}/>
                    </div>
    
                    <input className='mb-6 border border-gray-300 bg-[#49FCFC] text-center text-2xl text-[#3C3C3C] font-bold py-1 px-7 rounded-xl cursor-pointer shadow-md transition hover:opacity-80' type='submit' value='Sign up'/>

                    <p>Already have an account? <Link to="/login" className='cursor-pointer'>Login</Link></p>
    
                    </form>
    
            </section>
        )
}

export default Signup