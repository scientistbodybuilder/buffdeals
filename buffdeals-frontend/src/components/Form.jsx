import React, { useState, useEffect } from 'react'
import Card from './Card'

const Form = () => {
    const [data,setData] = useState([])
    const [splitData, setSplitData] = useState([])
    const [loading,setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [formData, setFormData] = useState({
        'supplement':'',
        'weight':'',
        'min_price':'',
        'max_price':'',
    })
    const [state, setState] = useState({
        'vegan': true,
        'isolate': false
    })

    const handleToggle = ({ target }) =>
        setState(s => ({ ...s, [target.name]: !s[target.name] }));

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
        console.log(`new form data: ${formData['supplement']}`)
    };
    
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
   

    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }

    const Submit = (e) => {
        e.preventDefault()
        setLoading(true)
        
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
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='weight' name='weight' type='number' min={0} onChange={handleChange}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min_price'>Min Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='min_price' name='min_price' type='number' min={0} onChange={handleChange}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='max_price'>Max Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='max_price' name='max_price' type='number' min={0} onChange={handleChange}/>
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
                loading ? (
                    <img src='./spinner-200px-200px.svg' />
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-16'>
                        <h2 className='mb-4 text-sm text-gray-500'>Products with '*' have more sizes</h2>
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