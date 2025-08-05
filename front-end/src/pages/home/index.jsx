import React from 'react'
import hero from '../../assets/hero.jpg'
import Container from '../../components/Container'
import { Calendar, Heart, Luggage, MapPin, MapPinned, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { testFetch } from '../../rest/client'
import { useSession } from '../../context/SessionContext'

export default function index() {
    const { user } = useSession()
    // const { data, error } = useQuery({
    //     queryKey: ['test'],
    //     queryFn: testFetch
    // })

    // React.useEffect(() => {
    //     console.log(data)
    //     console.log(error)
    // }, [data, error])

    return (
        <div className='bg-base-100 pb-10'>
            <div
                className='h-[240px] w-full text-white pt-10'
                style={{
                    backgroundImage: `url(${hero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container>
                    <p className='text-lg text-white/80'>
                        Service Request With<br></br>
                        <span className='text-3xl text-white'>Professional Driver</span>
                    </p>
                </Container>
            </div>
            <Container>
                <div className="join w-full flex border border-base-content/30 bg-base-100 -mt-14 rounded-md shadow">
                    <div className='flex-1 border-r border-base-content/30 px-4'>
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">
                                <MapPinned />
                                Location
                            </legend>
                            <input type="text" className="input w-full input-ghost focus-within:outline-0" placeholder="Where are you going?" />
                        </fieldset>
                    </div>
                    <div className='flex-1 px-4'>
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">
                                <Calendar />
                                Start Date
                            </legend>
                            <input type="date" className="input w-full input-ghost focus-within:outline-0" placeholder="Where are you going?" />
                        </fieldset>
                    </div>
                    <button className="join-item px-10 text-lg bg-[#c59d3e] text-white">
                        SEARCH
                    </button>
                </div>

                <div className='flex gap-10 mt-10'>
                    <div className="join join-vertical w-[300px]">
                        <div className='join-item border-base-content/20 border pt-10 px-4 pb-2'>
                            <h3 className='font-semibold'>FILTER BY</h3>
                        </div>
                        <div className="collapse collapse-arrow join-item border-base-content/20 border">
                            <input type="checkbox" defaultChecked />
                            <div className="collapse-title text-sm font-semibold">Filter Price</div>
                            <div className="collapse-content text-sm">
                                <div className='grid grid-cols-2 gap-2'>
                                    <fieldset className="fieldset w-full">
                                        <legend className="fieldset-legend">Min</legend>
                                        <input type="number" className="input input-sm" placeholder='Enter min price' />
                                    </fieldset>
                                    <fieldset className="fieldset w-full">
                                        <legend className="fieldset-legend">Max</legend>
                                        <input type="number" className="input input-sm" placeholder='Enter max price' />
                                    </fieldset>
                                </div>
                                <button className='py-3 font-semibold text-[#c59d3e] hover:opacity-70 cursor-pointer'>
                                    APPLY
                                </button>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow join-item border-base-content/20 border">
                            <input type="checkbox" defaultChecked />
                            <div className="collapse-title text-sm font-semibold">Review Score</div>
                            <div className="collapse-content text-sm">
                                <div className='space-y-2'>
                                    <label className='flex gap-2'>
                                        <input type="radio" className="radio checkbox-sm" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                    </label>
                                    <label className='flex gap-2'>
                                        <input type="radio" className="radio checkbox-sm" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} />
                                    </label>
                                    <label className='flex gap-2'>
                                        <input type="radio" className="radio checkbox-sm" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} />
                                        <Star size={18} />
                                    </label>
                                    <label className='flex gap-2'>
                                        <input type="radio" className="radio checkbox-sm" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} />
                                        <Star size={18} />
                                        <Star size={18} />
                                    </label>
                                    <label className='flex gap-2'>
                                        <input type="radio" className="radio checkbox-sm" />
                                        <Star size={18} fill="#1d325d" />
                                        <Star size={18} />
                                        <Star size={18} />
                                        <Star size={18} />
                                        <Star size={18} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 flex flex-col items-end justify-start gap-4'>
                        <div className='flex items-center'>
                            <p className='w-28'>Sort by:</p>
                            <select className='select'>
                                <option value="">Recommended</option>
                            </select>
                        </div>
                        <div className='grid grid-cols-3 gap-10'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className='border border-base-content/20 relative'>
                                    <Heart className='absolute z-2 right-3 top-3' />
                                    <img src='/car2.png' className='aspect-[4/3] object-cover w-full' />
                                    <div className='p-3'>
                                        <h2 className='font-medium text-lg'>Car Name</h2>
                                        <p className='text-sm text-base-content/60 my-1'>Calbayog City</p>
                                        <div className='flex justify-between p-2'>
                                            <div className='flex flex-col items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='text-base-content/60' width={24} height={24} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 12c1.873 0 3.57.62 4.815 1.487c1.183.825 2.185 2.051 2.185 3.37c0 .724-.309 1.324-.796 1.77c-.458.421-1.056.694-1.672.88C15.301 19.88 13.68 20 12 20s-3.301-.12-4.532-.493c-.616-.186-1.214-.459-1.673-.88C5.31 18.182 5 17.582 5 16.858c0-1.319 1.002-2.545 2.185-3.37C8.43 12.62 10.127 12 12 12m0 2c-1.44 0-2.743.48-3.67 1.127c-.989.69-1.33 1.392-1.33 1.73c0 .304.352.494.672.614l.205.07l.17.052c.94.284 2.32.407 3.953.407c1.508 0 2.799-.105 3.728-.344l.304-.087l.19-.06c.343-.117.778-.314.778-.652s-.341-1.04-1.33-1.73C14.744 14.481 13.44 14 12 14m7-1c1.044 0 1.992.345 2.693.833c.64.447 1.307 1.19 1.307 2.096c0 1.335-1.297 1.813-2.463 1.98l-.3.037l-.289.025l-.138.008c.122-.345.19-.72.19-1.122a3.8 3.8 0 0 0-.107-.888c.386-.03.703-.08.939-.151c.104-.032.01-.13-.1-.215l-.107-.078l-.076-.051a2.7 2.7 0 0 0-.995-.418c-.38-.76-.964-1.418-1.586-1.943A4.8 4.8 0 0 1 19 13M5 13q.537.002 1.032.113c-.622.525-1.206 1.183-1.586 1.943a2.7 2.7 0 0 0-.995.418l-.128.088c-.127.092-.276.22-.155.256c.236.071.553.122.94.151a3.7 3.7 0 0 0-.108.888c0 .402.068.777.19 1.122l-.28-.02l-.296-.03c-1.202-.147-2.614-.607-2.614-2c0-.905.666-1.649 1.307-2.096A4.76 4.76 0 0 1 5 13m13.5-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5M12 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m6.5 6a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1m-13 0a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1M12 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4"></path></g></svg>
                                                <span className='text-sm'>6</span>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='text-base-content/60' width={24} height={24} viewBox="0 0 512 512"><path fill="currentColor" d="M82.64 48.26a51.94 51.94 0 0 0-51.68 51.94a51.94 51.94 0 0 0 42.2 50.9v209.7a51.94 51.94 0 0 0-42.2 51a51.94 51.94 0 0 0 51.94 51.9a51.94 51.94 0 0 0 51.9-51.9a51.94 51.94 0 0 0-42.15-51v-95.1H246.2v95.1a51.94 51.94 0 0 0-42.2 51a51.94 51.94 0 0 0 52 51.9a51.94 51.94 0 0 0 51.9-51.9a51.94 51.94 0 0 0-42.2-51v-95.1h173.1V151.1a51.94 51.94 0 0 0 42.2-50.9a51.94 51.94 0 0 0-51.9-51.94h-.2a51.94 51.94 0 0 0-51.7 51.94a51.94 51.94 0 0 0 42.2 50.9v95.1H265.7v-95.1a51.94 51.94 0 0 0 42.2-50.9A51.94 51.94 0 0 0 256 48.26h-.2A51.94 51.94 0 0 0 204 100.2a51.94 51.94 0 0 0 42.2 50.9v95.1H92.65v-95.1a51.94 51.94 0 0 0 42.15-50.9a51.94 51.94 0 0 0-51.9-51.94z"></path></svg>
                                                <span className='text-sm'>Manual</span>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <Luggage size={24} className='text-base-content/60' />
                                                <span className='text-sm'>2</span>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='text-base-content/60' width={24} height={24} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" fillRule="nonzero" d="M12 2c1.751 0 3.19.592 4.168 1.159C17.492 3.926 18 5.369 18 6.657v1.71a30 30 0 0 1 2.624 1.852a1 1 0 0 1-1.248 1.562A26 26 0 0 0 18 10.769v6.817A4.414 4.414 0 0 1 13.586 22h-3.172A4.414 4.414 0 0 1 6 17.586v-6.817c-.467.324-.93.657-1.375 1.012a1 1 0 0 1-1.25-1.562A30 30 0 0 1 6 8.368V6.657c0-1.289.508-2.731 1.832-3.498C8.81 2.592 10.25 2 12 2m4 9.414l-.121.122l-.136.144a3 3 0 0 0-.735 1.759l-.008.218V17l-.005.15a2 2 0 0 1-1.838 1.844L13 19h-2l-.15-.005a2 2 0 0 1-1.844-1.838L9 17v-3.343l-.007-.198a3 3 0 0 0-.723-1.764l-.149-.16l-.121-.12v6.17l.008.192a2.414 2.414 0 0 0 2.215 2.215l.191.008h3.172l.191-.008a2.414 2.414 0 0 0 2.215-2.215l.008-.191zM12 8c-.554 0-1.284.192-2.128.547q-.427.181-.859.398l-.43.223l.953.953a5 5 0 0 1 1.457 3.271l.007.265V17h2v-3.343a5 5 0 0 1 1.282-3.344l.182-.192l.953-.953a15 15 0 0 0-1.29-.621C13.285 8.192 12.555 8 12 8m0-4c-1.297 0-2.39.44-3.165.89C8.323 5.185 8 5.823 8 6.656v.56c.361-.185.729-.359 1.096-.514C10.034 6.308 11.054 6 12 6s1.966.308 2.904.703c.367.155.735.329 1.096.513v-.56c0-.832-.323-1.47-.835-1.767C14.39 4.44 13.297 4 12 4"></path></g></svg>
                                                <span className='text-sm'>4</span>
                                            </div>
                                        </div>
                                        <p className='text-base-content/80 text-sm'>from <span className='text-lg text-base-content/100 mx-1'>₱3000</span> /day</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
