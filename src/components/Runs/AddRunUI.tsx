import React from "react";
import { weekdays } from "@/lib/weekdays";
import MapLocationPicker from "../Map/MapLocationPicker";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../UI/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";
import { Switch } from "../UI/switch";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AddRunUIProps {
  name: string;
  setName: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  startDescription: string;
  setStartDescription: (value: string) => void;
  weekday: number;
  setWeekday: (value: number) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  distance: number;
  setDistance: (value: number) => void;
  location: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
  membersOnly: boolean;
  setMembersOnly: (value: boolean) => void;
  interval: string;
  setInterval: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSelect: (lat: number, lng: number) => void;
}

export default function AddRunUI(props: AddRunUIProps) {
  const {
    name,
    setName,
    difficulty,
    setDifficulty,
    startDescription,
    setStartDescription,
    weekday,
    setWeekday,
    startTime,
    setStartTime,
    distance,
    setDistance,
    location,
    membersOnly,
    setMembersOnly,
    interval,
    setInterval,
    handleSubmit,
    handleSelect,
  } = props;

  const [step, setStep] = React.useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Run</CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? "Basic Information" :
              step === 2 ? "Schedule & Location" :
              "Additional Details"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Run Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Trail Run"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    placeholder="5"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interval">Run Frequency</Label>
                  <Select value={interval} onValueChange={setInterval}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Biweekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekday">Day of the Week</Label>
                  <Select 
                    value={weekday.toString()} 
                    onValueChange={(val) => setWeekday(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekdays.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meeting Point</Label>
                  <div className="h-[200px] w-full rounded-md overflow-hidden border">
                    <MapLocationPicker
                      onSelect={handleSelect}
                      initialLocation={location}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDescription">Meeting Point Description</Label>
                  <Input
                    id="startDescription"
                    value={startDescription}
                    onChange={(e) => setStartDescription(e.target.value)}
                    placeholder="e.g., In front of the coffee shop"
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="membersOnly"
                    checked={membersOnly}
                    onCheckedChange={setMembersOnly}
                  />
                  <Label htmlFor="membersOnly">Members Only Run</Label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit">
                  Create Run
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
