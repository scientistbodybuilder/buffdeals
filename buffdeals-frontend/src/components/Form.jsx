import React, { useState, useEffect } from 'react'
import Card from './Card'

const Form = () => {
    const [data,setData] = useState(false)
    const [loading,isLoading] = useState(false)
    const test = [{'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein' //12
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein' //12
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'},{'size':'3lb','price':'CA44.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein'
                    },
                    {'name':'Supplement Name','href':'https://ca.myprotein.com/',
                        'sizes':[{'size':'6lb','price':'CA89.99'}],'brand':'My Protein' //12
                    },
                    ]
    
        const SplitData = (data) => {
            const pages = Math.ceil(data.length / 12)
            console.log(`pages: ${pages}`)
            const split = []
            for (let i=0;i<pages;i++){
                let c = data.slice(i*12,(i+1)*12)
                split[i] = c
            }
            console.log(split)
            return split
        }
        const split_data = SplitData(test)
        const [page,setPage] = useState(0)

        const Next = () => {
            console.log('next page')
            setPage(c=>c+1)
            console.log(`new page: ${page}`)
        }

        const Back = () => {
            console.log('prev page')
            setPage(c=>c-1)
            console.log(`new page: ${page}`)
        }

        const Submit = (e) => {
            e.preventDefault()
            console.log('submission clicked')
            fetch('/get-supplement')
                .then(res => {
                    if (!res.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    console.log(data);
                })
                            
        }

    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mt-24 mb-5'>
            <div className='flex items-center justify-evenly h-auto mt-16'>
                <form className='mx-auto w-100 flex flex-col justify-center items-center border border-gray-300 py-15 px-4 rounded-md' onSubmit={Submit}>
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='supplement'> Supplement</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='supplement' name='supplement' type='text' required placeholder='whey protein'/>
                    </div>
                
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='weight'>Weight (lbs)</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='weight' name='weight' type='number' min={0}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min-price'>Min Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='min-price' name='min-price' type='number' min={0}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='max-price'>Max Price</label>
                        <input className='border focus:outline-none border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='max-price' name='max-price' type='number' min={0}/>
                    </div>
                    
                    <div className='mb-5 flex justify-between items-center w-10/12'>
                        <label className='text-xl' for='vegan'>Vegan</label>
                        <input className='w-5 h-5' id='vegan' type="checkbox" name='vegan' value='Vegan' defaultChecked/>
                    </div>

                    <div className='mb-5 flex justify-between items-center w-10/12'>
                        <label className='text-xl' for='isolate'>Isolate</label>
                        <input className='w-5 h-5' id='isolate' type="checkbox" name='isolate' value='Isolate' defaultChecked/>
                    </div>
                    

                    <input className='border border-gray-300 bg-[#49FCFC] text-center text-3xl text-[#3C3C3C] font-bold py-1 px-7 rounded-xl cursor-pointer shadow-md transition hover:opacity-80' type='submit' value='Search'/>
                </form>

                <div>
                </div>
                
            </div>

            <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-16'>
                <div className='grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4 w-full place-items-center'>
                    {split_data[page].map((item) => (               
                        <Card supplement_name={item['name']} brand={item['brand']} sizes={item['sizes']} />                        
                    ))}
                </div>
                
                {page === 0 && split_data.length>1 && (<div className='mt-16 flex items-center justify-center gap-4'>
                     <button type='button' className=' cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Next()}>Next</button>
                     </div>)}
                {page === (split_data.length-1) && split_data.length>1 && page!=0 && (<div className='mt-16 flex items-center justify-center gap-4'>
                    <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Back()}>Back</button>
                    </div>)}
                {page < (split_data.length-1) && page > 0 && (<div className='mt-16 flex items-center justify-center gap-4'>
                    <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Back()}>Back</button>
                    <button type='button' className='cursor-pointer rounded-2xl px-7 py-2 font-semibold text-2xl text-black text-center' onClick={()=>Next()}>Next</button>
                    </div>)}

            </div>
        </section>
    )
}

export default Form