import { useUploadAvatar } from '../avatars/useUploadAvatar';

interface InstagramPost {
    url: string;
    displayUrl: string;
    caption?: string;
}

interface InstagramProfile {
    profileImageUrl: string | null;
    profileDescription: string | null;
    recentPosts: InstagramPost[];
}

const useGetProfileImage = () => {
    const uploadAvatar = useUploadAvatar();

    const getProfileImage = async ({ instagramUsername }: { instagramUsername: string }): Promise<InstagramProfile> => {
        let profileImageUrl: string | null = null;
        let profileDescription: string | null = null;
        let recentPosts: InstagramPost[] = [];

        try {
            const response = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.NEXT_PUBLIC_APIFY_KEY}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    usernames: [instagramUsername],
                    resultsLimit: 6
                }),
            });

            const instagramData = await response.json();
            console.log("instagramData", instagramData);

            if (Array.isArray(instagramData) && instagramData.length > 0) {
                const firstItem = instagramData[0];
                profileDescription = firstItem?.biography || null;
                profileImageUrl = firstItem?.profilePicUrlHD || null;
                
                // Get recent posts
                if (firstItem?.latestPosts) {
                    recentPosts = firstItem.latestPosts
                        .slice(0, 6)
                        .map((post: any) => ({
                            url: post.url,
                            displayUrl: post.displayUrl,
                            caption: post.caption
                        }));
                }
            } else {
                console.error("No items found in instagramData");
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }

        return {
            profileImageUrl,
            profileDescription,
            recentPosts
        };
    };

    return { getProfileImage };
};

export default useGetProfileImage;
