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

            const instagramData = await response.json();
            console.log("instagramData", instagramData);

            if (Array.isArray(instagramData) && instagramData.length > 0) {
                const firstItem = instagramData[0];
                profileDescription = firstItem?.biography || null;
                profileImageUrl = firstItem?.profilePicUrlHD || null;
                console.log("profileImageUrl", profileImageUrl);
            } else {
                console.error("No items found in instagramData");
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }

        return { profileImageId, profileImageUrl, profileDescription };
    };

    return getProfileImage;
};

export default useGetProfileImage;
