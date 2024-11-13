import ClubIconBar from "../icons/ClubIconBar";

interface ClubCardProps {
  avatarUrl: string;
  name: string;
  description: string;
  instagramUsername: string;
  websiteUrl: string;
}

export default function ClubCard({
  avatarUrl,
  name,
  description,
  instagramUsername,
  websiteUrl,
}: ClubCardProps) {
  return (
    <div className="flex-col mt-5 lg:max-w-7xl md:w-2/3  sm:flex-row justify-center self-center">
      <div className="flex flex-col sm:flex-row  bg-white gap-x-5 border p-3 rounded-md">
        <img
          src={avatarUrl}
          alt={name}
          className="rounded-md border lg:w-1/4 sm:w-1/6 h-auto max-h-48 object-cover mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="flex flex-col max-w-2xl py-4 justify-between">
          <div>
            <h1>{name}</h1>
            <p className="mt-2">{description}</p>
          </div>
          <ClubIconBar
            instagramUsername={instagramUsername}
            websiteUrl={websiteUrl}
          />
        </div>
      </div>
    </div>
  );
}
