import React from 'react'

const Card = (props) => {
    // console.log(`brand: ${props.brand}`)
    // console.log(`name: ${props.supplement_name}`)
    // console.log(`sizes: ${props.sizes}`)
    return(
        <div className='shadow-md rounded-lg h-25 w-full max-w-md md:max-w-lg px-4 py-2 border border-gray-300 cursor-pointer flex items-center justify-between hover:bg-gray-100'>
            <a href={props.url} target='_blank' className='w-full flex flex-col items-center justify-between gap-1'>
                <h1 className='lg:text-base text-sm font-semibold'>{props.supplement_name}</h1>
                <div className='w-full flex flex-wrap items-center justify-evenly md:gap-1 gap-0.1'>
                    {
                        props.brand.length > 16 ? (
                            <p className='text-xs'>{props.brand}</p>
                        ) : (
                            <p className='md:text-sm text-xs'>{props.brand}</p>
                        )
                    }
                    <p className='text-sm'>{props.sizes[0]['price']}</p>
                    {
                        props.sizes.length == 1 ?     
                            props.sizes[0]['size'].length > 16 ? (
                                <p className='text-xs'>{props.sizes[0]['size']}</p>
                            ) : (
                                <p className='md:text-sm text-xs'>{props.sizes[0]['size']}</p>
                            )
                            :
                         props.sizes[0]['size'].length > 16 ? (
                                <p className='text-xs'>{props.sizes[0]['size']} *</p>
                            ) : (
                                <p className='md:text-sm text-xs'>{props.sizes[0]['size']} *</p>
                            )
                    }
                </div>

            </a>
            

        </div>
    )
}

export default Card