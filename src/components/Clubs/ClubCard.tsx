import ClubIconBar from "../Icons/ClubIconBar";

interface ClubCardProps {
  avatarUrl?: string;
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
    <div className="flex flex-col mt-5 max-w-full   sm:flex-row justify-center self-center">
      <div className="flex flex-col sm:flex-row bg-white gap-x-5 border p-3 rounded-md ">
        <img
          src={avatarUrl || "/assets/default-fallback-image.png"}
          alt={name}
          className="rounded-md border w-full sm:w-1/3 lg:w-1/5 h-auto object-cover mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold">{name}</h1>
            <p className="mt-2 text-gray-600">{description}</p>
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
