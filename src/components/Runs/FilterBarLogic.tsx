"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterBarUI from "./FilterBarUI";

interface FilterBarLogicProps {
  onFilterChange: (filters: {
    maxDistance?: number;
    days?: number[];
    difficulty?: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarLogicProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allowedDistances = [5, 7, 10, 15, 21, 42];
  const [distanceIndex, setDistanceIndex] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const resetFilters = () => {
    setDistanceIndex(null);
    setSelectedDays([]);
    setDifficulty(null);
  };

  useEffect(() => {
    const filters = {
      maxDistance:
        distanceIndex !== null ? allowedDistances[distanceIndex] : undefined,
      days: selectedDays.length > 0 ? selectedDays : undefined,
      difficulty: difficulty || undefined,
    };

    onFilterChange(filters);

    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          query.set(key, value.join(","));
        } else {
          query.set(key, value.toString());
        }
      }
    });

    router.push(`?${query.toString()}`);
  }, [distanceIndex, selectedDays, difficulty]);

  useEffect(() => {
    const maxDistance = searchParams.get("maxDistance");
    const weekday = searchParams.get("weekday");
    const difficulty = searchParams.get("difficulty");

    if (maxDistance) {
      const maxDistanceIndex = allowedDistances.indexOf(
        parseInt(maxDistance, 10)
      );
      if (maxDistanceIndex !== -1) setDistanceIndex(maxDistanceIndex);
    }

    if (weekday) setSelectedDays(weekday.split(",").map(Number));
    if (difficulty) setDifficulty(difficulty);
  }, [searchParams]);

  return (
    <FilterBarUI
      allowedDistances={allowedDistances}
      distanceIndex={distanceIndex}
      selectedDays={selectedDays}
      toggleDay={toggleDay}
      setDistanceIndex={setDistanceIndex}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      resetFilters={resetFilters}
    />
  );
}
