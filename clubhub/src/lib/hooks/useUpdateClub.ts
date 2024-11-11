// src/lib/db/queries/updateClub.ts

export interface UpdateClubData {
    name?: string;
    description?: string;
    locationLat?: number;
    locationLng?: number;
  }
  
  export async function updateClub(slug: string, data: UpdateClubData) {
    const response = await fetch(`/api/club/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update club');
    }
  
    return response.json();
  }