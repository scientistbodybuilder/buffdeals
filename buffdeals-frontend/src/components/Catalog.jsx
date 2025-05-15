import React, {useState, useEffect} from 'react'
import Card from './Card'

const Catalog = (props) => {
    const [splitData, setSplitData] = useState(()=>{
        const storedData = localStorage.getItem('SCRAPE_DATA')
        return storedData ? JSON.parse(storedData) : []
    })

    // const [loading,setLoading] = useState(false)
    const [page,setPage] = useState(0)
    // const [formData, setFormData] = useState({
    //     'supplement':'',
    //     'weight':'',
    //     'min_price':'',
    //     'max_price':'',
    // })
    //loading.io for spinner
    // const [state, setState] = useState({
    //     'vegan': true,
    //     'isolate': false
    // })

    useEffect(() => {
        const split_data = window.localStorage.getItem('SCRAPE_DATA')
        if (split_data != null){
            setSplitData(JSON.parse(split_data))
        }
        
    },[])

    useEffect(() => {
        window.localStorage.setItem('SCRAPE_DATA',JSON.stringify(splitData))
    }, [splitData])

    

    // const handleToggle = ({ target }) =>
    //     setState(s => ({ ...s, [target.name]: !s[target.name] }));

    // const handleChange = (e) => {
    //     setFormData((prev) => ({
    //     ...prev,
    //     [e.target.name]: e.target.value,
    //     }));
    //     console.log(`new form data: ${formData['supplement']}`)
    // };
    
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

    const data = props.data
    setSplitData(SplitData(data))
    

    const Next = () => {
        setPage(c=>c+1)
    }

    const Back = () => {
        setPage(c=>c-1)
    }
    

    return(
        <div className='w-full px-10 flex flex-col items-center justify-center'>
        
            <div className='flex flex-col items-center justify-center mx-auto w-2/3 mt-16'>
                <h2 className='mb-4 text-sm text-gray-500 font-bold'>Products with '*' have more sizes</h2>
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

        </div>
    )  
    
}

// const CatalogContainer = () => {
//     const [formSubmitted, setFormSubmitted] = useState(false)
//     return(
//         <section className='w-full px-10 flex flex-col items-center justify-center'>
//             {formSubmitted && <Catalog />}

//         </section>

//     )
// }

export default Catalog