function Icon({ icon, text, className }) {
  const HeroIcon = icon
  return (
    <div className={`flex items-center space-x-1 ${className || ''}`}>
      <HeroIcon className='w-4 h-4' />
      <p className='text-xs sm:text-sm'>{text}</p>
    </div>
  )
}

export default Icon