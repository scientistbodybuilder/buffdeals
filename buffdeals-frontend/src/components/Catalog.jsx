import React, {useState, useEffect} from 'react'
import Card from './Card'
import { Autocomplete } from '@mantine/core';
import Header from './Header';
import { FaSearch } from "react-icons/fa";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Catalog = () => {
    const { session } = UserAuth()
    console.log(session)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [searchKey, setSearchKey] = useState('')
    const SplitData = (data) => {
        const pages = Math.ceil(data.length / 12)
        // console.log(`pages: ${pages}`)
        const split = []
        for (let i=0;i<pages;i++){
            let c = data.slice(i*12,(i+1)*12)
            split[i] = c
        }
        return split
    }
        
    const [sortSetting,setSortSettingg] = useState(null)
    const [data, setData] = useState(()=>{
        const storedData = localStorage.getItem('DB_DATA')
        return storedData ? JSON.parse(storedData) : []
    })

    const [splitData,setSplitData] = useState(() => {
        return data ? SplitData(data) : []
    })


    const [searched, setSearched] = useState(()=>{
        const search = localStorage.getItem('SEARCHED')
        return search ? true : false
    })

    useEffect(() => {
        const split_data = window.localStorage.getItem('DB_DATA')
        if (split_data != null){
            setSplitData(JSON.parse(split_data))
        }
        
    },[])

    useEffect(() => {
        window.localStorage.setItem('DB_DATA',JSON.stringify(splitData))
    }, [splitData])

    useEffect(()=>{
        const session_email = session?.user?.email
        setEmail(session_email)
    },[])

    

    // const handleToggle = ({ target }) =>
    //     setState(s => ({ ...s, [target.name]: !s[target.name] }));

    const handleSearch = (e) => {
        setSearchKey(e.target.value)
        console.log(`new search key: ${searchKey}`)
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
        console.log(`new form data: ${formData['supplement']}`)
    };
    
    const SearchDB = () => {
        console.log('pressed search button')
    }
    
    
    

    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }
    

    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mt-24 mb-5'>
            <div className='mb-25 w-full mt-10 px-5 flex justify-center'>             
                <div className='flex items-center w-full justify-center'>
                    <div className='max-w-xl border focus:outline-none border-gray-300 bg-gray-100 rounded-xl px-4 py-2 w-full text-black mr-3'>
                        <Autocomplete 
                        placeholder='Search'
                        data={[
                            'creatine',
                            'creatine monohydrate',
                            'isolate',
                            'protein',
                            'whey',
                            'whey isolate',
                            'whey protein',
                            'vegan protein',

                        ]}/>
                    </div>
                    <button onClick={()=>SearchDB} className='cursor-pointer'>
                        <FaSearch size={20} />
                    </button>
                </div>
            </div>

            <div className='flex flex-col mb-5 w-full mt-2 px-5'>
                <h2 className='md:text-lg text-sm font-semibold mb-2'>Recent Searches</h2>
                <ul className='flex gap-2 items-center'>
                    <li className='border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100'>Protein</li>
                    <li className='border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100'>Creatine</li>
                    <li className='border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100'>BCAA</li>
                </ul>
            </div>

            {
                (loading && formSubmitted) ? (
                    <img src='./spinner-200px-200px.svg' />
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-16'>
                        <h2 className='mb-4 text-sm text-gray-500 font-bold'>Products with '*' have more sizes</h2>
                        <div className='mb-2 w-full mt-2 px-5'>
                            <ul className='flex gap-2 items-center'>
                                <li className='md:text-lg text-sm font-semibold'>Sort By</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100 ${sortSetting === 'Size' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Size')}>Size</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100 ${sortSetting === 'Price' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Price')}>Price</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100 ${sortSetting === 'Value' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Value')}>Value</li>
                            </ul>
                        </div>
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4 w-full place-items-center'>
                            {splitData[page]?.map((item) => (               
                                <Card supplement_name={item['name']} brand={item['brand']} sizes={item['sizes']} url={item['href']}/>                        
                            ))}
                        </div>
                        
                        {page === 0 && splitData.length>1 && (<div className='mt-16 flex items-center justify-center gap-4'>
                            <button type='button' className=' cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Next()}>Next</button>
                            </div>)}
                        {page === (splitData.length-1) && splitData.length>1 && page!=0 && (<div className='mt-16 flex items-center justify-center gap-4'>
                            <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Back()}>Back</button>
                            </div>)}
                        {page < (splitData.length-1) && page > 0 && (<div className='mt-16 flex items-center justify-center gap-4'>
                            <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Back()}>Back</button>
                            <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Next()}>Next</button>
                            </div>)}

                    </div>
                )
            }
        </section>
    )  
    
}

const CatalogContainer = () => (
    <div className='flex justify-center items-center w-full'>
        <Header />
        <Catalog />
    </div>
)




export default CatalogContainer