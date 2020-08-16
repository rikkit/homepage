export default function Avatar({ name, avatar }) {
  const url = avatar?.url;

  return (
    <div className="flex items-center">
      {url && (
        <img
          src={`${
            url.startsWith('/') ? process.env.API_URL : ''
            }${url}`}
          className="w-12 h-12 rounded-full mr-4 grayscale"
          alt={name}
        />
      )}
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
