import Image from 'next/image'
import { useRouter } from 'next/router'
import useMediaQuery from '../../hooks/useMediaQuery'
import { PlayIcon } from "@heroicons/react/solid";
import { ClockIcon, ThumbUpIcon } from "@heroicons/react/outline";

function Banner({ anime }) {
    const isMedium = useMediaQuery('(min-width: 768px)')
    const isLarge = useMediaQuery('(min-width: 1024px)')
    const router = useRouter()

    let description = ""

    if (isLarge) {
        description = anime.description.substr(0, 320)
    } else if (isMedium) {
        description = anime.description.substr(0, 300)
    }

    return (
    <div className='relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]'>
      {anime.bannerImage ?
        <Image
          priority
          src={anime.bannerImage}
          layout='fill'
          objectFit='cover'
          className='opacity-60'
        />
        : null
      }

      <div className='text-white absolute ml-5 sm:ml-8 mt-8 lg:mt-10 xl:mt-12 2xl:mt-14 space-y-2'>
        <p className='font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>{anime.title.english}</p>
        <p className='text-gray-300 font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'>{anime.title.romaji}</p>

        <div className='flex space-x-2'>
            <div className='flex items-center space-x-1'>
                <PlayIcon className='w-4 h-4' />
                <p className='text-xs sm:text-sm xl:text-base'>{anime.format}</p>
            </div>
            <div className='flex items-center space-x-1'>
                <ClockIcon className='w-4 h-4' />
                <p className='text-xs sm:text-sm xl:text-base'>{anime.duration} Min/Ep</p>
            </div>
            <div className='flex items-center space-x-1'>
                <ThumbUpIcon className='w-4 h-4' />
                <p className='text-xs sm:text-sm xl:text-base'>{anime.meanScore}%</p>
            </div>
        </div>

        <div className='flex space-x-4'>
            {anime.genres.map(genre => <p className='p-1 rounded text-xs sm:text-sm bg-white text-black'>{genre}</p>)}
        </div>

        {/* todo, find a safer way */}
        {description ?
            <p className='mt-4 max-w-3xl' dangerouslySetInnerHTML={{ __html: `${description}...` }}></p>
            : null
        }

        <button
          className='text-xs sm:text-sm md:text-base mt-4 rounded-lg p-1 bg-[#C3073F] active:scale-90 transform transition duration-300 ease-in'
          onClick={()=>router.push(`/anime/${anime.id}`)}
        >
          Read more
        </button>
      </div>

    </div>
    )
}

export default Banner