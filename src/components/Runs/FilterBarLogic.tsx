"use client";
import { useEffect, useState } from "react";
import FilterBarUI from "./FilterBarUI";

interface FilterBarLogicProps {
  onFilterChange: (filters: {
    minDistance?: number;
    maxDistance?: number;
    days?: number[];
    difficulty?: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarLogicProps) {
  const allowedDistances = [5, 7, 10, 15, 21, 42];
  const [distanceIndex, setDistanceIndex] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue],
    );
  };

  const resetFilters = () => {
    setDistanceIndex(null);
    setSelectedDays([]);
    setDifficulty(null);
  };

  useEffect(() => {
    const filters: {
      minDistance?: number;
      maxDistance?: number;
      days?: number[];
      difficulty?: string;
    } = {};

    if (distanceIndex !== null) {
      filters.minDistance = 0;
      filters.maxDistance = allowedDistances[distanceIndex];
    }

    if (selectedDays.length > 0) {
      filters.days = selectedDays;
    }

    if (difficulty) {
      filters.difficulty = difficulty;
    }

    onFilterChange(filters);
  }, [distanceIndex, selectedDays, difficulty]);

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
