"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterBarUI from "./FilterBarUI";

interface FilterBarLogicProps {
  onFilterChange: (filters: { days?: number[] }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarLogicProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const resetFilters = () => {
    setSelectedDays([]);
  };

  useEffect(() => {
    const filters: { days?: number[] } = {
      days: selectedDays.length > 0 ? selectedDays : undefined,
    };

    onFilterChange(filters);

    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && Array.isArray(value)) {
        query.set(key, value.join(","));
      }
    });

    router.push(`?${query.toString()}`);
  }, [selectedDays]);

  useEffect(() => {
    const weekday = searchParams.get("weekday");
    if (weekday) setSelectedDays(weekday.split(",").map(Number));
  }, [searchParams]);

  return (
    <FilterBarUI
      selectedDays={selectedDays}
      setSelectedDays={setSelectedDays}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      toggleDay={toggleDay}
      resetFilters={resetFilters}
    />
  );
}
