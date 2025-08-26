import React, {useState, useEffect} from 'react'
import Card from './Card'
import { Autocomplete, ModalTitle } from '@mantine/core';
import Header from './Header';
import { FaSearch, FaFilter } from "react-icons/fa";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

import { loadRecent, searchProducts, SearchDB } from '../services/dataUtils';
import { comparePrice, compareSize, compareValue } from '../services/utils';
import SearchSettings from './SearchSettings';


const Catalog = () => {
    const { session } = UserAuth()
    // console.log(session)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [data, setData] = useState([])
    const [splitData,setSplitData] = useState([])
    const [loading, setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [searchKey, setSearchKey] = useState('')
    const [searchSettings, setSearchSettings] = useState({'min_price': 0, 'max_price': 1000, 'vegan_only': false})
    const [sortSetting,setSortSetting] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const closeModal = () => {
        setModalOpen(false)
    }

    const submitModal = (min_price, max_price, vegan_only) => {
        setSearchSettings({'min_price': min_price, 'max_price': max_price, 'vegan_only': vegan_only})
        setModalOpen(false)
    }

    const SplitData = (data) => {
        const pages = Math.ceil(data.length / 20)
        const split = []
        for (let i=0;i<pages;i++){
            let c = data.slice(i*20,(i+1)*20)
            split[i] = c
        }
        return split
    }

    const Search = async (searchKey, searchSettings) => {
        setLoading(true)
        try {
            console.log('searching for: ', searchKey)
            console.log('search settings: ', searchSettings)
            const results = await SearchDB(searchKey, searchSettings)
            console.log('search results: ', results)
            if (results) {
                setData(results)
                setSplitData(SplitData(results))
            }
        } catch (err) {
            console.error('Error searching products:', err) 
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => {
            const recent = await loadRecent()
            console.log('recent: ', recent)
            if (recent) {
                setData(recent)
                setSplitData(SplitData(recent))
            }
        }
        load()   
    },[])
        

    const [searched, setSearched] = useState(()=>{
        const search = localStorage.getItem('SEARCHED')
        return search ? true : false
    })

    const [searchHistory, setSearchHistory] = useState(()=>{
        const search_history = localStorage.getItem('SEARCH_HISTORY')
        return search_history ? JSON.parse(search_history) : []
    })


    useEffect(() => {
            window.localStorage.setItem('SEARCHED', searched)
    }, [searched])

    useEffect(() => {
            window.localStorage.setItem('SEARCH_HISTORY', JSON.stringify(searchHistory))
    }, [searchHistory])

    useEffect(()=>{
        const session_email = session?.user?.email
        setEmail(session_email)
    },[])

    const handleSearch = (e) => {
        setSearchKey(e.target.value)
        console.log(searchKey)
    }

    const Sort = (by) => {
        console.log('sorting')
        if (by=='Price' && data.length > 0){
            setSortSetting('Price')
            const sorted = data.sort(comparePrice)
            setData(sorted)
            setSplitData(SplitData(data))
        } else if (by=='Size' && data.length > 0){
            setSortSetting('Size')
            const sorted = data.sort(compareSize)
            setData(sorted)
            setSplitData(SplitData(data))
        } else if (by=='Value' && data.length > 0) {
            setSortSetting('Value')
            const sorted = data.sort(compareValue)
            setData(sorted)
            setSplitData(SplitData(data))
        }
    }
    
    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }
    

    return(
        <section className='flex flex-col items-center justify-start w-full px-10 mt-24 mb-5'>
            <div className='mb-8 w-full mt-4 px-5 flex justify-center'>             
                <div className='flex items-center w-full md:w-7/12 justify-center border-gray-300 border-1 rounded-xl'>
                    {/* <div className='max-w-xl border focus:outline-none border-gray-300 bg-gray-100 rounded-xl px-4 py-2 w-full text-black mr-3'>
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
                    </div> */}
                    <input className='border-r-1 focus:outline-none border-gray-300 bg-white rounded-tl-xl rounded-bl-xl px-4 py-2 w-full text-black mr-3' type='text' placeholder='Search' onChange={handleSearch}/>
                    <button onClick={() => Search(searchKey, searchSettings)} className='cursor-pointer'>
                        <FaSearch size={20} />
                    </button>
                    <button className='cursor-pointer mx-3' onClick={() => setModalOpen(true)}>
                        <FaFilter size={20} color='#40A9EA' />
                    </button>
                </div>
            </div>

            {/* <div className='flex flex-col mb-5 w-full mt-2 px-5'>
                <h2 className='md:text-lg text-sm font-semibold mb-2'>Recent Searches</h2>
                <ul className='flex gap-2 items-center'>
                    {
                        searchHistory?.map((item) => (
                            <li className='border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100' onClick={() => SearchDB(item)}>{item}</li>
                        ))
                    }
                </ul>
            </div> */}

            {
                (loading) ? (
                    <img src='spinner-200px-200px.svg' />
                ) : (
                    <div className='flex flex-col items-center justify-center w-full mt-2'>
                        <h2 className='mb-3 text-sm text-gray-500 font-bold'>Products with '*' have more sizes</h2>
                        <div className='mb-2 w-11/12 mt-2 px-5'>
                            <ul className='flex gap-2 items-center'>
                                <li className='md:text-base text-sm font-semibold'>Sort By</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-base text-sm font-semibold hover:bg-gray-100 ${sortSetting === 'Size' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Size')}>Size</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-base text-sm font-semibold hover:bg-gray-100 ${sortSetting === 'Price' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Price')}>Price</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-base text-sm font-semibold hover:bg-gray-100 ${sortSetting === 'Value' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Value')}>Value</li>
                            </ul>
                        </div>
                        {splitData.length == 0 ? (<div className='text-xl text-gray-500 font-semibold mt-10'>No products found</div>) :
                        (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:grid-cols-[repeat(2,minmax(300px,1fr))] lg:grid-cols-[repeat(3,minmax(300px,1fr))] xl:grid-cols-[repeat(4,minmax(300px,1fr))] gap-3 lg:gap-5 w-full place-items-center'>
                            {splitData[page]?.map((item,key) => (
                                <Card key={key} supplement_name={item['trunc_name']} brand={item['brand']} sizes={item['sizes']} url={item['href']}/>                        
                            ))}
                        </div>
                        )} 
                        
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

            <SearchSettings open={modalOpen} onClose={closeModal} submit={submitModal} />
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