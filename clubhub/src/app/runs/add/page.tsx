import AddClub from "@/components/clubs/AddClub";
import AddRun from "@/components/runs/AddRun";

export default function addRuns() {
  return (
    <div className="flex-col p-10  items-center w-2/3">
      <h1 className="text-2xl font-bold mb-4">Add Club</h1>
      <div className="flex justify-between">
        <AddRun />
      </div>
    </div>
  );
}
