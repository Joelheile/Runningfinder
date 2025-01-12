import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { useState, useEffect } from "react";
import RunCardUI from "./RunCardUI";
import { Skeleton } from "@/components/UI/skeleton";
import { getNextIntervalDate } from "@/lib/getNextIntervalDate";
import { fetchWeatherData } from "@/lib/fetchWeatherData";
import { useRouter } from "next/navigation";

interface RunCardProps {
  id: string;
  time: string;
  distance: number;
  location: { lat: number; lng: number };
  intervalDay: number;
  name: string;
  startDescription: string;
  difficulty: string;
  userId: string | undefined;
  slug: string;
}

export default function RunCard({
  id,
  time,
  distance,
  location,
  intervalDay,
  name,
  startDescription,
  difficulty,
  userId,
  slug,
}: RunCardProps) {
  const [likeFilled, setLikeFilled] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [wind, setWind] = useState(0);
  const [uvIndex, setUvIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  const registerMutation = useRegisterRun();
  const cancelRegistrationMutation = useCancelRegistration();

  const handleRegistration = () => {
    if (!userId) {
      router.replace(`/api/auth/signin?callbackUrl=/clubs/${slug}`);
    } else {
      if (likeFilled) {
        cancelRegistrationMutation.mutate({ runId: id, userId });
      } else {
        registerMutation.mutate({ runId: id, userId });
      }
      setLikeFilled(!likeFilled);
    }
  };
  const deleteRunMutation = useDeleteRun();

  const handleDeleteRun = () => {
    deleteRunMutation.mutate(id);
  };

  useEffect(() => {
    const nextIntervalDate = getNextIntervalDate(intervalDay);
    fetchWeatherData(location.lat, location.lng, nextIntervalDate)
      .then((weatherData) => {
        setTemperature(weatherData.temperature);
        setWind(weatherData.wind);
        setUvIndex(weatherData.uvIndex);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch weather data:", error);
        setLoading(false);
      });
  }, [intervalDay, location]);

  if (loading) {
    return (
      <div className="mt-2">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-2" />
      </div>
    );
  }

  return (
    <RunCardUI
      intervalDay={intervalDay}
      name={name}
      time={time}
      distance={distance}
      difficulty={difficulty}
      startDescription={startDescription}
      googleMapsUrl={googleMapsUrl}
      likeFilled={likeFilled}
      handleRegistration={handleRegistration}
      handleDeleteRun={handleDeleteRun}
      temperature={temperature}
      wind={wind}
      uvIndex={uvIndex}
    />
  );
}
