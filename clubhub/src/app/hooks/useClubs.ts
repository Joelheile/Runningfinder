import { useQuery } from "@tanstack/react-query";

const fetchClubs = async () => {
  const response = await fetch("/api/clubs");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  console.log("response", response);
  return response.json();
};

export function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}
