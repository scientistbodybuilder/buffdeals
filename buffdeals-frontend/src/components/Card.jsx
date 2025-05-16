import React from 'react'

const Card = (props) => {
    console.log(`brand: ${props.brand}`)
    console.log(`name: ${props.supplement_name}`)
    console.log(`sizes: ${props.sizes}`)
    return(
        <div className='shadow-md rounded-lg h-24 w-full max-w-md px-4 py-2 border border-gray-300 cursor-pointer flex items-center justify-between hover:bg-gray-100'>
            <a href={props.url} target='_blank' className='w-full flex items-center justify-between'>
                <h1 className='w-2/3 text-lg font-semibold'>{props.supplement_name}</h1>
                <div className='w-1/3 flex flex-col items-center justify-evenly gap-1'>
                    {
                        props.brand.length > 16 ? (
                            <p className='text-xs'>{props.brand}</p>
                        ) : (
                            <p className='text-sm'>{props.brand}</p>
                        )
                    }
                    <p className='text-sm'>{props.sizes[0]['price']}</p>
                    {
                        props.sizes.length == 1 ?     
                            props.sizes[0]['size'].length > 16 ? (
                                <p className='text-xs'>{props.sizes[0]['size']}</p>
                            ) : (
                                <p className='text-sm'>{props.sizes[0]['size']}</p>
                            )
                            
                         : props.sizes[0]['size'].length > 16 ? (
                                <p className='text-xs'>{props.sizes[0]['size']} *</p>
                            ) : (
                                <p className='text-sm'>{props.sizes[0]['size']} *</p>
                            )
                    }
                </div>

            </a>
            

        </div>
    )
}

export default Card