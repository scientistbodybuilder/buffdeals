import React, {useState, useEffect} from 'react'
import Card from './Card'

const Catalog = () => {
    const data = [{'name':'Supplement Name','href':'https://ca.myprotein.com/',
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
                
                ]

        const SplitData = (data) => {
            const pages = Math.floor(data.length / 9)
            const split_data = []
            for (i=0;i<pages;i++){
                split = data.slice(i,(i+1)*9)
                split_data[i] = split
            }
            return split_data
        }
        const split_data = SplitData(data)
        const [page,setPage] = useState(1)

        
    return(
        <section className=' flex flex-col items-center justify-center mx-auto w-2/3'>
            <div className='grid-cols-3'>
                {split_data[page-1].forEach((item) => {           
                    return(
                        <Card supplement_name={item['name']} brand={item['brand']} price={item[0][price]} size={item[0][size]}/>
                    )
                })}
            </div>
            

        </section>
    )
}

const CatalogContainer = () => {
    const [formSubmitted, setFormSubmitted] = useState(false)
    return(
        <section className='w-full px-10 flex flex-col items-center justify-center'>
            {formSubmitted && <Catalog />}

        </section>

    )
}

export default CatalogContainer