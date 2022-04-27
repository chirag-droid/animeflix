import Image from "next/image";
import { base64SolidImage } from "@utility/image";
import { useRouter } from "next/router";
import { PlayIcon } from "@heroicons/react/solid";
import { ClockIcon, ThumbUpIcon } from "@heroicons/react/outline";
import Icon from "@components/Icon";

function Card({ anime }) {
  const router = useRouter();

  const changeRoute = () => {
    router.push({
      pathname: `/watch/${anime.id}`,
      query: { episode: 1 },
    });
  };

  return (
    <div
      className="flex space-x-4 ml-2 text-white py-2 h-30 cursor-pointer hover:scale-105 transform transition duration-300 ease-out"
      onClick={changeRoute}>
      <div className="relative w-24 h-32">
        <Image
          alt={anime.title.english || anime.title.romaji}
          src={anime.coverImage.large || anime.coverImage.medium || anime.bannerImage}
          layout="fill"
          objectPosition="left"
          className="rounded-md"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(anime.coverImage.color)}`}
        />
      </div>

      <p className="w-48">{anime.title.english || anime.title.romaji}</p>

      <div className="flex space-x-2 text-white text-xs bottom-0 right-0">
        <Icon icon={PlayIcon} text={anime.format} className="hidden sm:flex" />
        <Icon icon={ClockIcon} text={`${anime.duration} Min`} />
        <Icon icon={ThumbUpIcon} text={`${anime.meanScore}%`} />
      </div>
    </div>
  );
}

export default Card;
