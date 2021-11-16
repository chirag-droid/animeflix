import { useRouter } from "next/router"
import Image from "next/image"
import { PlayIcon } from "@heroicons/react/solid";
import { ClockIcon, ThumbUpIcon } from "@heroicons/react/outline";
import Icon from '../Icon'

function Card({anime}) {
  const router = useRouter()

  return (
    <div className='w-52 sm:w-56 p-2 hover:scale-105 transform transition duration-300 ease-out'>
      <div className='relative w-40 sm:w-52 h-48 sm:h-64 cursor-pointer' onClick={()=>router.push(`/anime/${anime.id}`)}>
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
    
      <div className='flex space-x-2 text-white text-xs mx-auto'>
        <Icon icon={PlayIcon} text={anime.format} className='hidden sm:flex' />
        <Icon icon={ClockIcon} text={`${anime.duration} Min`} />
        <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
      </div>
    </div>
  )
}
  
export default Card