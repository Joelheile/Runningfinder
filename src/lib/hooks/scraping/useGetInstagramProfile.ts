import { v4 } from 'uuid';
import { useUploadAvatar } from '../avatars/useUploadAvatar';

const useGetProfileImage = () => {
    const uploadAvatar = useUploadAvatar();

    const getProfileImage = async ({ instagramUsername }: { instagramUsername: string }) => {
        let profileImageId: string | null = null;
        let profileImageUrl: string | null = null;
        let profileDescription: string | null = null;

        try {
            const response = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.NEXT_PUBLIC_APIFY_KEY}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames: [instagramUsername] }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Instagram data');
            }

            const instagramData = await response.json();
            console.log("instagramData", instagramData);
            console.log("bio data", instagramData.items[0].biography);
            if (instagramData.items && instagramData.items.length > 0) {
                profileDescription = instagramData.items[0].biography;
            }
            if (instagramData.items.length > 0) {
                const profilePicUrl = instagramData.items[0].profilePicUrl;
                const avatarFile = await fetch(profilePicUrl).then((r) => r.blob());

                const convertedFile = new File([avatarFile], "avatar.jpg", { type: avatarFile.type });

                profileImageId = await uploadAvatar.uploadAvatar(convertedFile, v4());
                console.log("avatarFileId", profileImageId);

                profileImageUrl = profilePicUrl;
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }

        return { profileImageId, profileImageUrl, profileDescription };
    };

    return getProfileImage;
};

export default useGetProfileImage;
