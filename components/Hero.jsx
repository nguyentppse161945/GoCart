// 'use client'
// import { assets } from '@/assets/assets'
// import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'
// import CategoriesMarquee from './CategoriesMarquee'

// const Hero = () => {

//     const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

//     return (
//         <div className='mx-6'>
//             <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
//                 <div className='relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group'>
//                     <div className='p-5 sm:p-16'>
//                         <div className='inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
//                             <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
//                         </div>
//                         <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs  sm:max-w-md'>
//                             Gadgets you'll love. Prices you'll trust.
//                         </h2>
//                         <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
//                             <p>Starts from</p>
//                             <p className='text-3xl'>{currency}4.90</p>
//                         </div>
//                         <button className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</button>
//                     </div>
//                     <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm' src={assets.hero_model_img} alt="" />
//                 </div>
//                 <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
//                     <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
//                         <div>
//                             <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
//                             <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
//                         </div>
//                         <Image className='w-35' src={assets.hero_product_img1} alt="" />
//                     </div>
//                     <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
//                         <div>
//                             <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
//                             <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
//                         </div>
//                         <Image className='w-35' src={assets.hero_product_img2} alt="" />
//                     </div>
//                 </div>
//             </div>
//             <CategoriesMarquee />
//         </div>

//     )
// }

// export default Hero

'use client'
import { assets } from '@/assets/assets'
import { ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

  const sliderData = [
    {
      id: 1,
      tag: 'NEWS',
      highlight: 'Free Shipping on Orders Above $50!',
      title: "Gadgets you'll love. Prices you'll trust.",
      price: `${currency}4.90`,
      button: 'LEARN MORE',
      bgColor: 'bg-green-200',
      tagColor: 'bg-green-600',
      tagBg: 'bg-green-300 text-green-600',
      textGradient: 'from-slate-600 to-[#A0FF74]',
      imgSrc: assets.hero_model_img,
    },
    {
      id: 2,
      tag: 'HOT',
      highlight: 'Exclusive Fashion Deals!',
      title: "Style that speaks louder than words.",
      price: `${currency}14.99`,
      button: 'SHOP NOW',
      bgColor: 'bg-orange-200',
      tagColor: 'bg-orange-600',
      tagBg: 'bg-orange-300 text-orange-600',
      textGradient: 'from-slate-600 to-[#FF7AB5]',
      imgSrc: assets.hero_product_img1,
    },
    {
      id: 3,
      tag: 'SALE',
      highlight: 'Up to 40% Off Electronics!',
      title: "Upgrade your world with premium gadgets.",
      price: `${currency}29.00`,
      button: 'DISCOVER',
      bgColor: 'bg-blue-200',
      tagColor: 'bg-blue-600',
      tagBg: 'bg-blue-300 text-blue-600',
      textGradient: 'from-slate-600 to-[#78B2FF]',
      imgSrc: assets.hero_product_img2,
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [sliderData.length])

  const handleSlideChange = () => {
    setCurrentSlide(index)
  }

  return (
    <div className='mx-6'>
      <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>

        {/* 🔥 SLIDER SECTION */}
        <div className="relative flex-1 overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderData.map((slide, index) => (
              <div
                key={slide.id}
                className={`relative flex flex-col ${slide.bgColor} rounded-3xl xl:min-h-100 group min-w-full`}
              >
                <div className='p-5 sm:p-16'>
                  <div className={`inline-flex items-center gap-3 ${slide.tagBg} pr-4 p-1 rounded-full text-xs sm:text-sm`}>
                    <span className={`${slide.tagColor} px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs`}>{slide.tag}</span>
                    {slide.highlight}
                    <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                  </div>

                  <h2 className={`text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r ${slide.textGradient} bg-clip-text text-transparent max-w-xs sm:max-w-md`}>
                    {slide.title}
                  </h2>

                  <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                    <p>Starts from</p>
                    <p className='text-3xl'>{slide.price}</p>
                  </div>

                  <button className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>
                    {slide.button}
                  </button>
                </div>

                <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm' src={slide.imgSrc} alt={slide.title} />
              </div>
            ))}
          </div>

          {/* dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {sliderData.map((_, index) => (
              <div
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-2.5 w-2.5 rounded-full cursor-pointer transition ${
                  currentSlide === index ? 'bg-slate-800' : 'bg-gray-400/40'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* ✅ RIGHT SMALL CARDS STAY SAME */}
        <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
          <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
              <p className='flex items-center gap-1 mt-4'>View more →</p>
            </div>
            <Image className='w-35' src={assets.hero_product_img1} alt="" />
          </div>
          <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
              <p className='flex items-center gap-1 mt-4'>View more →</p>
            </div>
            <Image className='w-35' src={assets.hero_product_img2} alt="" />
          </div>
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  )
}

export default Hero
