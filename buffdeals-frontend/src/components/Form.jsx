import React, { useState, useEffect } from 'react'
import Card from './Card'

const Form = () => {
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
        const storedData = localStorage.getItem('SCRAPE_DATA')
        return storedData ? JSON.parse(storedData) : []
    })

    const [splitData,setSplitData] = useState(() => {
        return data ? SplitData(data) : []
    })


    const [formSubmitted, setFormSubmitted] = useState(()=>{
        const submission = localStorage.getItem('FORM_SUBMISSION')
        return submission ? true : false
    })
    const [loading,setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [formData, setFormData] = useState({
        'supplement':'',
        'weight':'',
        'min_price':'',
        'max_price':'',
    })
    //loading.io for spinner
    const [state, setState] = useState({
        'vegan': true,
        'isolate': true
    })

    useEffect(() => {
        const scrape_data = window.localStorage.getItem('SCRAPE_DATA')
        if (scrape_data != null){
            const parsed = JSON.parse(scrape_data)
            setData(parsed)
            setSplitData(SplitData(parsed))
        }
        
    },[])

    useEffect(() => {
        window.localStorage.setItem('SCRAPE_DATA',JSON.stringify(data))
    }, [data])

    useEffect(() => {
        window.localStorage.setItem('FORM_SUBMISSION', formSubmitted)
    }, [formSubmitted])

    

    const handleToggle = ({ target }) =>
        setState(s => ({ ...s, [target.name]: !s[target.name] }));

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
        console.log(`new form data: ${formData['supplement']}`)
    };
    
    
   

    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }

    const Submit = (e) => {
        e.preventDefault()
        setLoading(true)
        setFormSubmitted(true)
        
        if (formData.min_price == '' | formData.max_price == '' | formData.min_price < formData.max_price ) {
            console.log('request made')
            fetch('http://localhost:5000'+'/get-supplement',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        'supplement':formData.supplement,
                        'weight':formData.weight,
                        'max_price':formData.max_price,
                        'min_price':formData.min_price,
                        'vegan':state.vegan,
                        'isolate':state.isolate
                    })
                }
            ).then(res => {
                    if (!res.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    console.log(data);
                    setSplitData(SplitData(data))
                })
                .catch(error => {
                    console.error(error)
                }).finally(
                    () => setLoading(false)
                )

        } else {
            console.log('problem with request')
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
        if (by=='Price' && data.length > 0){
            setSortSettingg('Price')
            const sorted = data.sort(comparePrice)
            setData(sorted)
            setSplitData(SplitData(data))
        } else if (by=='Size' && data.length > 0){
            setSortSettingg('Size')
            const sorted = data.sort(compareSize)
            setData(sorted)
            setSplitData(SplitData(data))
        } else if (by=='Value' && data.length > 0) {
            setSortSettingg('Value')
            const sorted = data.sort(compareValue)
            setData(sorted)
            setSplitData(SplitData(data))
        }
    }


    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mt-24 mb-5'>
            <div className='flex items-center justify-evenly h-auto mt-16'>
                <form className='mx-auto w-100 flex flex-col justify-center items-center border border-gray-300 py-15 px-4 rounded-md' onSubmit={Submit}>
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='supplement'> Supplement</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='supplement' name='supplement' type='text' required placeholder='whey protein' onChange={handleChange}/>
                    </div>
                
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='weight'>Weight (lbs)</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='weight' name='weight' type='number' step="0.1" min={0} onChange={handleChange}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min_price'>Min Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='min_price' name='min_price' type='number' step="0.01" min={0} onChange={handleChange}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='max_price'>Max Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='max_price' name='max_price' type='number' step="0.01" min={0} onChange={handleChange}/>
                    </div>

                    {Object.keys(state).map(key => (
                        <div className='mb-5 flex justify-between items-center w-10/12'>
                            <label className='text-xl' for={key}>{String(key).charAt(0).toUpperCase() + String(key).slice(1)}</label>
                            <input
                            className='w-5 h-5'
                            type="checkbox"
                            onChange={handleToggle}
                            key={key}
                            name={key}
                            defaultChecked
                            />
                        </div>                      
                    ))}
                    

                    <input className='border border-gray-300 bg-[#49FCFC] text-center text-3xl text-[#3C3C3C] font-bold py-1 px-7 rounded-xl cursor-pointer shadow-md transition hover:opacity-80' type='submit' value='Search'/>
                </form>

                <div>
                </div>
                
            </div>

            {
                (loading && formSubmitted) ? (
                    <img src='./spinner-200px-200px.svg' />
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-16'>
                        <h2 className='mb-4 text-sm text-gray-500 font-bold'>Products with '*' have more sizes</h2>
                        <div className='mb-2 w-full mt-2 px-5'>
                            <ul className='flex gap-2 items-center'>
                                <li className='text-lg font-semibold'>Sort By</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 text-lg font-semibold hover:bg-gray-100 ${sortSetting === 'Size' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Size')}>Size</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 text-lg font-semibold hover:bg-gray-100 ${sortSetting === 'Price' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Price')}>Price</li>
                                <li className={`border border-gray-300 cursor-pointer rounded-md px-4 py-1 text-lg font-semibold hover:bg-gray-100 ${sortSetting === 'Value' ? 'bg-gray-100' : ''}`} onClick={() => Sort('Value')}>Value</li>
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

export default Form