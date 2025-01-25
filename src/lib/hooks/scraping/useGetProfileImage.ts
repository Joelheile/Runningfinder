import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useUploadAvatar } from '../avatars/useUploadAvatar';

const useGetProfileImage = ({ instagramUsername }: { instagramUsername: string }) => {
    const [profileImageId, setProfileImageId] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const uploadAvatar = useUploadAvatar();

    useEffect(() => {
        let isMounted = true;

        const fetchProfileImage = async () => {
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

                if (instagramData.items.length > 0) {
                    const profilePicUrl = instagramData.items[0].profilePicUrl;
                    const avatarFile = await fetch(profilePicUrl).then((r) => r.blob());

                    const convertedFile = new File([avatarFile], "avatar.jpg", { type: avatarFile.type });

                    const avatarFileId = await uploadAvatar.uploadAvatar(convertedFile, v4());
                    console.log("avatarFileId", avatarFileId);

                    if (isMounted) {
                        setProfileImageId(avatarFileId);
                        setProfileImageUrl(profilePicUrl);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        };

        fetchProfileImage();

        return () => {
            isMounted = false;
        };
    }, [uploadAvatar, instagramUsername]);

    return { profileImageId, profileImageUrl };
};

export default useGetProfileImage;
