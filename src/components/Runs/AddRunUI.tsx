import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import MapLocationPicker from "../Map/MapLocationPicker";
import { Button } from "../UI/button";
import { Checkbox } from "../UI/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../UI/dialog";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Progress } from "../UI/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";

interface AddRunUIProps {
  name: string;
  setName: (name: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  distance: string;
  setDistance: (distance: string) => void;
  showMap: boolean;

  weekday: number;
  setWeekday: (weekday: number) => void;
  startDescription: string;
  setStartDescription: (startDescription: string) => void;
  locationLat: number;
  locationLng: number;

  isRecurrent: boolean;
  setIsRecurrent: (isRecurrent: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleLocationSelect: (
    lat: number,
    lng: number,
    placeUrl: string,
    formattedAddress: string
  ) => void;
}

export default function AddRunUI({
  name,
  setName,
  difficulty,
  setDifficulty,
  distance,
  setDistance,
  weekday,
  setWeekday,
  startDescription,
  setStartDescription,
  locationLat,
  locationLng,

  isRecurrent,
  setIsRecurrent,
  handleSubmit,
  handleLocationSelect,
}: AddRunUIProps) {
  const [step, setStep] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const totalSteps = 2;

  const validateStep1 = () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the run");
      return false;
    }
    if (!difficulty) {
      toast.error("Please select a difficulty level");
      return false;
    }
    if (!distance.trim() || isNaN(parseFloat(distance))) {
      toast.error("Please enter a valid distance");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!weekday && weekday !== 0) {
      toast.error("Please select a weekday");
      return false;
    }
    if (!locationLat || !locationLng) {
      toast.error("Please select a location on the map");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleClose = () => {
    setStep(1);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
    setIsOpen(open);
  };

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Run
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Run</DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Step {step} of {totalSteps}:
              </span>
              <span className="font-medium">
                {step === 1
                  ? "Basic Information"
                  : step === 2
                    ? "Schedule & Location"
                    : ""}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === totalSteps && validateStep2()) {
              handleSubmit(e);
              handleClose();
            }
          }}
          className="space-y-8"
        >
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name of the run</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sunday coffee run"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy</SelectItem>
                    <SelectItem value="intermediate">
                      🟡 Intermediate
                    </SelectItem>
                    <SelectItem value="advanced">🔴 Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Distance in kilometers"
                  className="w-full"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col justify-center space-y-2">
                  <Label className="text-sm font-medium">Select Weekday</Label>
                  <Select
                    value={weekday.toString()}
                    onValueChange={(value) => setWeekday(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weekday" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                      <SelectItem value="0">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 px-4 py-3 rounded-lg">
                    <Checkbox
                      id="isRecurrent"
                      checked={isRecurrent}
                      onCheckedChange={setIsRecurrent}
                      className="border-gray-400 data-[state=unchecked]:bg-gray-100"
                    />
                    <Label htmlFor="isRecurrent" className="font-medium">
                      Is this a weekly run?
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-[300px] rounded-md overflow-hidden">
                  <MapLocationPicker
                    onSelect={(lat, lng, placeUrl, formattedAddress) =>
                      handleLocationSelect(lat, lng, placeUrl, formattedAddress)
                    }
                    onCancel={() => {
                      setIsOpen(true);
                    }}
                    location={{
                      lat: locationLat || 52.52,
                      lng: locationLng || 13.405,
                    }}
                  />
                </div>
                {locationLat !== 0 && locationLng !== 0 && (
                  <div className="text-sm text-muted-foreground">
                    Drag the pin to change the meeting point
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label>Start Description</Label>
                  <span className="text-sm text-muted-foreground">
                    Where are you meeting? Enter the name of the location or a
                    specific detail (e.g. In front of the main entrance)
                  </span>
                </div>
                <Input
                  type="text"
                  value={startDescription}
                  onChange={(e) => setStartDescription(e.target.value)}
                  placeholder="E.g., In front of the main entrance"
                  className="w-full"
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button type="submit">Create Run</Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
