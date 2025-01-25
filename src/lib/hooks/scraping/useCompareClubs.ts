
interface CompareClubProps {
    clubName: string;
  }
  
  export const compareClubs = async ({ clubName }: CompareClubProps): Promise<string> => {
    const clubSlug = clubName.toLowerCase().replace(/ /g, "-");
    console.log("clubSlug", clubSlug);
  
    const clubs = await fetch("/api/clubs/").then((r) => r.json());
    console.log("clubs", clubs);
    if (clubs != null) {
      const clubNames = clubs.map((club: any) => club.name).join(", ");
      const message = `Imagine you are a comparison bot and your only task is to compare if an input string can be found inside of an array. This is the input (a running club): ${clubSlug}. 
      It has to be very similar, but if for example Berlin is appended, and you can find it in the array, it is the same. Output only true or false.
          Array: ${clubNames}`;
  
      const answerMessage = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ message }),
      }).then((r) => r.json());
  
      return answerMessage;
    }
    return "false";
  };