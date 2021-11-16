import AnimeCard from "./Card"

function Section({title, animeList}) {
    return (
        <>
        <p className='font-semibold text-white mt-4 ml-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>{title}</p>

        <div className='flex mt-2 mb-8 space-x-1 scrollbar-hide overflow-scroll ml-4'>
          {animeList.map(anime => <AnimeCard anime={anime}/>)}
        </div>
        </>
    )
}

export default Section