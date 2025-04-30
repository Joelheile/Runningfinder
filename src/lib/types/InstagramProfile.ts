export interface InstagramProfile {
  profileImageUrl: string | null;
  profileDescription: string | null;
  recentPosts: Array<{
    url: string;
    displayUrl: string;
    caption?: string;
  }>;
}
