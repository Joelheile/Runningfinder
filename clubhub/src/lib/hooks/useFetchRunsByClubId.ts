import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Run } from "../types/Run";

const fetchRunsByClubId = async (clubId: string): Promise<Run[]> => {
    const response = await axios.get(`/api/runs/${clubId}`);
    console.log("Response status:", response.status);
    if (response.status !== 200) {
      throw new Error("Failed to fetch runs by club ID");
    }
    console.log("Fetched runs by club ID:", response.data);
    return response.data;
  };
  
  export function useFetchRunsByClubId(clubId: string) {
    console.log("Fetching runs by club ID:", clubId);
    return useQuery({
      queryKey: ["runs", clubId],
      queryFn: () => fetchRunsByClubId(clubId),
    });
  }
  