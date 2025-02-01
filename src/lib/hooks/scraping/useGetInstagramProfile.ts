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


  const getInstagramProfile = async ({
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

    try {
      console.log('Fetching Instagram profile for:', instagramUsername);
      
      const response = await fetch('/api/instagram/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' 
        },
        body: JSON.stringify({ instagramUsername }),
      }); 

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Instagram API error:', responseData);
        throw new Error(responseData.error || `Instagram API error: ${response.status}`);
      }

      if (!Array.isArray(responseData)) {
        console.error('Invalid response format:', responseData);
        throw new Error("Invalid response from Instagram API");
      }

      if (responseData.length === 0) {
        console.error('No profile data found for:', instagramUsername);
        throw new Error(`No Instagram profile found for username: ${instagramUsername}`);
      }

      console.log('Successfully fetched Instagram profile:', {
        username: responseData[0].username,
        hasImage: !!responseData[0].profilePicUrl,
        hasDescription: !!responseData[0].biography
      });

      const firstItem = responseData[0];
      if (!firstItem) {
        throw new Error("Instagram profile data is empty");
      }

      profileDescription = firstItem.biography || null;
      profileImageUrl =
        firstItem.profilePicUrlHD || firstItem.profilePicUrl || null;

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




export default getInstagramProfile;                
