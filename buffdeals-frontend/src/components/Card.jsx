import React, { useState, useEffect } from 'react'
import { fetchImg } from '../services/dataUtils'

const Card = (props) => {
    const [imageSrc, setImageSrc] = useState('')

    useEffect(() => {
        const loadImage = async (path) => {
            const img = await fetchImg(path)
            if (img) {
                setImageSrc(URL.createObjectURL(img))
            } else {
                setImageSrc('/no_image.jpg')
            }
        }

        if (props.image_path) {
            loadImage(props.image_path)
        }
        // If no image_path, imageSrc is already set to default
    }, [props.image_path])

    return(
        <div className='shadow-md hover:shadow-lg rounded-lg h-auto w-full max-w-md md:max-w-lg px-4 py-2 border border-gray-300 cursor-pointer flex items-center justify-between'>
            <a href={props.url} target='_blank' className='w-full flex flex-col items-center justify-between gap-1'>
                <div className='w-full h-25 flex items-center justify-center mb-2'>
                    {imageSrc != '' && <img src={imageSrc} alt={props.supplement_name} className='w-full h-full object-contain' />}
                </div>
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