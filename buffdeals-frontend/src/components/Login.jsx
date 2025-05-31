import React, {useState, useEffect} from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';


const Login = () => {
    const navigate = useNavigate()
    const { session, signIn } = UserAuth()
    // console.log(session)
    const [formData, setFormData] = useState({
            'email':'',
            'password':'',
        })
    const [flash,setFlash] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')

    const Submit = async (e) => {
        e.preventDefault()
        try {
            const response = await signIn(formData['email'],formData['password'])
            if (response.success){
                console.log('sign in success')
                navigate('/dashboard')
            } else if (response.existingAcc){
                setFlashMessage("Incorrect password")
                setFlash(true)
                setTimeout(()=>{
                    setFlash(false)
                },5000)
            } else {
                setFlashMessage("Invalid Credentials")
                setFlash(true)
                setTimeout(()=>{
                    setFlash(false)
                },5000)
            }

        } catch(e) {
            console.log(`Sign in error: ${e}`)
            setFlashMessage("Invalid Credentials")
            setFlash(true)
            setTimeout(()=>{
                setFlash(false)
            },5000)
        }
        
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
        console.log(`new form data: ${formData['email']}`)
    };
    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mb-5 h-screen'>
            <form className='mx-auto w-100 flex flex-col justify-center items-center border border-gray-300 rounded-md bg-[#fff]' onSubmit={Submit}>
                
                <div className='bg-[#49FCFC] flex justify-center items-center w-full h-auto py-3 mb-25'>
                    <h2 className='font-bold text-3xl tracking-tighter'>BUFF DEALS</h2>
                </div>


                <div className='mb-5 w-10/12'>
                    <label className='block text-xl mb-2' for='email'>Email</label>
                    <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='email' name='email' type='text' required onChange={handleChange}/>
                </div>
                
                <div className='mb-5 w-10/12'>
                    <label className='block text-xl mb-2' for='password'>Password</label>
                    <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='password' name='password' type='password' required  onChange={handleChange}/>
                </div>

                <input className='mb-6 border border-gray-300 bg-[#49FCFC] text-center text-2xl text-[#3C3C3C] font-bold py-1 px-7 rounded-xl cursor-pointer shadow-md transition hover:opacity-80' type='submit' value='Login'/>

                <p className='mb-2'>Don't have an account? <Link to="/signup" className='cursor-pointer'>Sign up</Link></p>

                <p className='mb-10'><Link to="/" className='cursor-pointer'>Back to search</Link></p>

                {flash && (
                    <p className='mb-6 font-medium text-[red] text-sm'>
                        {flashMessage}
                    </p>
                )}

                </form>

        </section>
    )
}

export default Login