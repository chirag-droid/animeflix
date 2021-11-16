import { useRouter } from "next/router"
import Image from "next/image"
import { PlayIcon } from "@heroicons/react/solid";
import { ClockIcon, ThumbUpIcon } from "@heroicons/react/outline";

function Card({anime}) {
    const router = useRouter()

    return (
        <div className='w-52 p-2 hover:scale-105 transform transition duration-300 ease-out'>
            <div className='relative w-48 h-64 cursor-pointer' onClick={()=>router.push(`/anime/${anime.id}`)}>
                <Image
                    src={anime.coverImage.extraLarge}
                    layout='fill'
                    objectPosition='center'
                    className='rounded-md'
                />
            </div>

            <div className='h-20'>
                <span className='text-sm mt-2 text-white'>{anime.title.romaji}</span>
            </div>

            <div className='flex space-x-2 text-white text-xs'>
                <div className='flex items-center space-x-1'>
                    <PlayIcon className='w-4 h-4' />
                    <p>{anime.format}</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <ClockIcon className='w-4 h-4' />
                    <p>{anime.duration} Min</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <ThumbUpIcon className='w-4 h-4' />
                    <p>{anime.meanScore}%</p>
                </div>
            </div>
        </div>
    )
}

export default Card