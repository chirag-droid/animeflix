import Banner from "../../components/anime/Banner"
import Header from "../../components/Header"

function Anime({anime}) {
    return (
      <>
        <Header />
        <Banner anime={anime} />
      </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params

    const query = `{
      Media(id: ${id}, type: ANIME) {
        id
        bannerImage
        title {
          english
          romaji
        }
        duration
        description
        genres
        format
        meanScore
      }
    }
    `
  
    const url = 'https://graphql.anilist.co',
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: query
            })
          }
  
    const response = await (await fetch(url, options)).json()
  
    if(!response.data.Media) {
        return {
            notFound: true
        }
    }

    return {
      props: {
        anime: response.data.Media
      }
    }
}

export default Anime