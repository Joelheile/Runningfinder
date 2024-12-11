import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import RunCardUI from "./RunCardUI";

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

const getNextIntervalDate = (intervalDay: number) => {
  const today = new Date();
  const nextDate = new Date();
  nextDate.setDate(today.getDate() + ((intervalDay - today.getDay() + 7) % 7));
  return nextDate;
};

const fetchWeatherData = async (lat: number, lng: number, date: Date) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,wind_speed_10m_max,uv_index_max&start_date=${date.toISOString().split("T")[0]}&end_date=${date.toISOString().split("T")[0]}&timezone=auto`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  const data = await response.json();
  if (data && data.daily) {
    return {
      temperature: data.daily.temperature_2m_max[0],
      wind: data.daily.wind_speed_10m_max[0],
      uvIndex: data.daily.uv_index_max[0],
    };
  } else {
    throw new Error("Invalid weather data");
  }
};

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

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  const registerMutation = useRegisterRun();
  const cancelRegistrationMutation = useCancelRegistration();

  const handleRegistration = () => {
    if (!userId) {
      redirect(`/api/auth/signin?callbackUrl=/clubs/${slug}`);
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
      })
      .catch((error) => {
        console.error("Failed to fetch weather data:", error);
      });
  }, [intervalDay, location]);

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
