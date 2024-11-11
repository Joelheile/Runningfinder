"use client";
import { useEffect, useState } from "react";
import FilterBarUI from "./FilterBarUI";

interface FilterBarLogicProps {
  onFilterChange: (filters: {
    minDistance: number;
    maxDistance: number;
    days: number[];
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarLogicProps) {
  const allowedDistances = [5, 7, 10, 15, 21, 42];
  const [distanceIndex, setDistanceIndex] = useState(
    allowedDistances.indexOf(10),
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue],
    );
  };

  useEffect(() => {
    onFilterChange({
      minDistance: 0,
      maxDistance: allowedDistances[distanceIndex],
      days: selectedDays,
    });
  }, [distanceIndex, selectedDays]);

  return (
    <FilterBarUI
      allowedDistances={allowedDistances}
      distanceIndex={distanceIndex}
      selectedDays={selectedDays}
      toggleDay={toggleDay}
      setDistanceIndex={setDistanceIndex}
    />
  );
}
