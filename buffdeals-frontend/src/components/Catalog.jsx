import React, {useState, useEffect} from 'react'
import Card from './Card'
import { Autocomplete, ModalTitle } from '@mantine/core';
import Header from './Header';
import { FaSearch } from "react-icons/fa";
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';


const Catalog = () => {
    const { session } = UserAuth()
    // console.log(session)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [searchKey, setSearchKey] = useState('')
    const SplitData = (db_data) => {
        const pages = Math.ceil(db_data.length / 12)
        // console.log(`pages: ${pages}`)
        const split = []
        for (let i=0;i<pages;i++){
            let c = db_data.slice(i*12,(i+1)*12)
            split[i] = c
        }
        return split
    }
        
    const [sortSetting,setSortSettingg] = useState(null)
    const [db_data, setData] = useState(()=>{
        const storedData = localStorage.getItem('DB_DATA')
        return storedData ? JSON.parse(storedData) : []
    })

    const [splitData,setSplitData] = useState(() => {
        return db_data ? SplitData(db_data) : []
    })


    const [searched, setSearched] = useState(()=>{
        const search = localStorage.getItem('SEARCHED')
        return search ? true : false
    })

    const [searchHistory, setSearchHistory] = useState(()=>{
        const search_history = localStorage.getItem('SEARCH_HISTORY')
        return search_history ? JSON.parse(search_history) : []
    })

    useEffect(() => {
            const db = window.localStorage.getItem('DB_DATA')
            if (db != null){
                const parsed = JSON.parse(db)
                setData(parsed)
                setSplitData(SplitData(parsed))
            }
            
        },[])

    useEffect(() => {
        window.localStorage.setItem('DB_DATA',JSON.stringify(db_data))
    }, [db_data])

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

    

    // const handleToggle = ({ target }) =>
    //     setState(s => ({ ...s, [target.name]: !s[target.name] }));

    const handleSearch = (e) => {
        setSearchKey(e.target.value)
        console.log(searchKey)
    }

    const updateSearches = async () => {
        const { data, error } = await supabase.from("users")
        .select("recent_searches")
        .eq('email', email)
        if (error) {

        } else {
            console.log('search history', data[0]['recent_searches'])
            let new_list
            if (data[0]['recent_searches'] && data[0]['recent_searches'].length > 2) {
                console.log('Existing search history of over 2 searches')
                data[0]['recent_searches'].push(searchKey)
                new_list = data[0]['recent_searches'].slice(1) 
            } else if (data[0]['recent_searches']) {
                console.log('Existing search history of under 3 searches')
                data[0]['recent_searches'].push(searchKey)
                new_list = data[0]['recent_searches']
            } else {
                console.log('No search history')
                new_list = [searchKey]
            }

            console.log(`search list: ${new_list}`)
            const { error } = await supabase.from("users")
            .update({recent_searches: new_list})
            .eq("email", email)
            if (error) {
                console.error('Error updating search history', error)
            } else {
                console.log('Search history updated')
                //update it on the ui
                setSearchHistory(new_list)
            }
        }
    }

    
    
    const SearchDB = async (search_term) => {
        setLoading(true)
        setSearched(true)
        try {
            console.log(`${email} is searching:`, search_term)
            // const searchTerms = searchKey.toLowerCase().split(" ")

            
            const { data, error } = await supabase.from("scraped_data")
            .select("*")
            .ilike('name', `%${search_term.toLowerCase().trim()}%`)

            if (error){
                console.error('Error in searching db', error)
            } else if (data) {
                console.log('DB search successful')
                console.log(`There are ${data.length} results\n`)
                
                setData(data)
                setSplitData(SplitData(data))

                //Update the most recent searches
                await updateSearches()
                
            } else {
                console.log('Db query successful, but no data')
            }
            setLoading(false)
        } catch (e) {
            console.error('Error', e)
            setLoading(false)
        }    
    }



    


    function comparePrice(a, b) {
        const pricea = a['sizes'][0]['price']
        const priceb = b['sizes'][0]['price']
        if (pricea < priceb) {
            return -1;
        } else if (pricea > priceb) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }
    
    function compareSize(a, b) {
        const pricea = a['sizes'][0]['size']
        const priceb = b['sizes'][0]['size']
        if (pricea < priceb) {
            return -1;
        } else if (pricea > priceb) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    function compareValue(a, b) {
        const pricea = a['sizes'][0]['value']
        const priceb = b['sizes'][0]['value']
        if (pricea < priceb) {
            return -1;
        } else if (pricea > priceb) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }
    


    const Sort = (by) => {
        if (by=='Price' && db_data.length > 0){
            setSortSettingg('Price')
            const sorted = db_data.sort(comparePrice)
            setData(sorted)
            setSplitData(SplitData(db_data))
        } else if (by=='Size' && db_data.length > 0){
            setSortSettingg('Size')
            const sorted = db_data.sort(compareSize)
            setData(sorted)
            setSplitData(SplitData(db_data))
        } else if (by=='Value' && db_data.length > 0) {
            setSortSettingg('Value')
            const sorted = db_data.sort(compareValue)
            setData(sorted)
            setSplitData(SplitData(db_data))
        }
    }
    
    
    

    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }
    

    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mt-24 mb-5'>
            <div className='mb-15 w-full mt-10 px-5 flex justify-center'>             
                <div className='flex items-center w-full justify-center'>
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
                    <input className='max-w-xl border focus:outline-none border-gray-300 bg-gray-100 rounded-xl px-4 py-2 w-full text-black mr-3' type='text' placeholder='Search' onChange={handleSearch}/>
                    <button onClick={() => SearchDB(searchKey)} className='cursor-pointer'>
                        <FaSearch size={20} />
                    </button>
                </div>
            </div>

            <div className='flex flex-col mb-5 w-full mt-2 px-5'>
                <h2 className='md:text-lg text-sm font-semibold mb-2'>Recent Searches</h2>
                <ul className='flex gap-2 items-center'>
                    {
                        searchHistory?.map((item) => (
                            <li className='border border-gray-300 cursor-pointer rounded-md px-4 py-1 md:text-lg text-base font-semibold hover:bg-gray-100' onClick={() => SearchDB(item)}>{item}</li>
                        ))
                    }
                </ul>
            </div>

            {
                (loading && searched) ? (
                    <img src='./spinner-200px-200px.svg' />
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-10'>
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
                                <Card supplement_name={item['trunc_name']} brand={item['brand']} sizes={item['sizes']} url={item['url']}/>                        
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