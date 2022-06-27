export interface AnimeFlixProps {
  className: string;
}

const AnimeFlixIcon: React.FC<AnimeFlixProps> = ({ className }) => (
  <svg
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M257.498 293.782L277.084 389.793H419.004L391.023 293.782H257.498Z"
      fill="#E50914"
    />
    <path
      d="M97.7692 289.197L76.673 389.793H272.903L253.317 293.782L97.7692 289.197Z"
      fill="#E50914"
    />
    <path d="M189.869 0H313.317L123.448 499.725H0L189.869 0Z" fill="#B1060F" />
    <path d="M317.467 0H189.869L384.402 512H512L317.467 0Z" fill="#E50914" />
    <path
      d="M248.226 293.526L267.987 389.56H295.529L291.137 293.526H248.226Z"
      fill="#E50914"
    />
  </svg>
);

export default AnimeFlixIcon;
