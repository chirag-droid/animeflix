import Image from 'next/image'
import { useRouter } from 'next/router'
import useMediaQuery from '@hooks/useMediaQuery'
import { PlayIcon } from "@heroicons/react/solid";
import { ClockIcon, ThumbUpIcon } from "@heroicons/react/outline";
import Icon from '@components/Icon'

function Banner({ anime, onLoadingComplete }) {
  const router = useRouter()

  const isMedium = useMediaQuery('(min-width: 768px)')
  const isLarge = useMediaQuery('(min-width: 1024px)')
  
  const { romaji, english } = anime.title
  let title = romaji || english
  title = title.split(" ").splice(0, 11).join(" ") + '...'

  let description = ""

  if (isLarge)
    description = anime.description.substr(0, 320)
  else if (isMedium)
    description = anime.description.substr(0, 300)

  const changeRoute = () => {
    if (router.route === '/') {
      router.push(`/anime/${anime.id}`)
    } else {
      router.push(`/watch/${anime.id}?episode=1`)
    }
  }

  return (
    <div className='relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]'>

      {/* The image behind the banner */}
      {anime.bannerImage ?
        <Image
          alt=""
          onLoadingComplete={onLoadingComplete}
          priority
          src={anime.bannerImage}
          layout='fill'
          objectFit='cover'
          className='opacity-60'
        />
        : onLoadingComplete()
      }

      <div className='text-white absolute ml-4 sm:ml-8 mt-4 sm:mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 space-y-2 md:space-y-3'>
        <p className='font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>{title}</p>
        {english && english.length > 35 ? null :
          <p className='text-gray-300 font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'>{english}</p>
        }


        <div className='flex space-x-2'>
          <Icon icon={PlayIcon} text={anime.format} />
          <Icon icon={ClockIcon} text={`${anime.duration} Min/Ep`} />
          <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
        </div>

        <div className='grid grid-cols-4 gap-x-1 sm:gap-x-3 md:gap-x-4 gap-y-1 mr-2 md:flex'>
          {anime.genres.map(genre => <p key={genre} className='p-1 rounded text-xs sm:text-sm bg-white text-black'>{genre}</p>)}
        </div>

        {/* todo, find a safer way */}
        {description ?
          <p className='max-w-3xl' dangerouslySetInnerHTML={{ __html: `${description}...` }}></p>
          : null
        }

        <button
          className='flex items-center px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base bg-[#C3073F] text-white active:scale-90 transform transition duration-300 ease-in'
          onClick={changeRoute}
        >
          <PlayIcon className='w-5 mr-1' />
          {router.route === "/" ? 'Read More' : 'Watch Now'}
        </button>
      </div>

    </div>
  )
}

export default Banner