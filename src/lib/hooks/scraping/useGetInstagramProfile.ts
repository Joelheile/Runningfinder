import { useUploadAvatar } from "../avatars/useUploadAvatar";

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
  const getProfileImage = async ({
    instagramUsername,
  }: {
    instagramUsername: string;
  }): Promise<InstagramProfile> => {
    let profileImageUrl: string | null = null;
    let profileDescription: string | null = null;
    let recentPosts: InstagramPost[] = [];

    if (!instagramUsername) {
      throw new Error("Instagram username is required");
    }

    if (!process.env.APIFY_KEY) {
      throw new Error("APIFY_KEY is not configured");
    }

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernames: [instagramUsername],
            resultsLimit: 6,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}`,
        );
      }

      const instagramData = await response.json();

      if (!Array.isArray(instagramData)) {
        throw new Error("Invalid response from Instagram API");
      }

      if (instagramData.length === 0) {
        throw new Error(
          `No Instagram profile found for username: ${instagramUsername}`,
        );
      }

      const firstItem = instagramData[0];
      if (!firstItem) {
        throw new Error("Instagram profile data is empty");
      }

      profileDescription = firstItem.biography || null;
      profileImageUrl = firstItem.profilePicUrlHD || firstItem.profilePicUrl || null;

      if (firstItem.latestPosts) {
        recentPosts = firstItem.latestPosts.slice(0, 6).map((post: any) => ({
          url: post.url,
          displayUrl: post.displayUrl,
          caption: post.caption,
        }));
      }

      if (!profileImageUrl) {
        throw new Error("Could not fetch Instagram profile image");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Error fetching Instagram profile";
      console.error("Instagram profile fetch error:", errorMessage);
      throw new Error(errorMessage);
    }

    return {
      profileImageUrl,
      profileDescription,
      recentPosts,
    };
  };

  return { getProfileImage };
};

export default useGetProfileImage;
