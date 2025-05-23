"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FilterBarUI from "./FilterBarUI";

interface FilterBarLogicProps {
  onFilterChange: (filters: {
    days?: number[];
    difficulty?: string;
    query?: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarLogicProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDays, setSelectedDays] = useState<number[]>(() => {
    const days = searchParams.get("weekdays");
    return days ? days.split(",").map(Number) : [];
  });

  const [difficulty, setDifficulty] = useState<string | null>(() => {
    return searchParams.get("difficulty");
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get("q") || "";
  });

  const toggleDay = useCallback((dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue].sort((a, b) => a - b),
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedDays.length > 0) {
      params.set("weekdays", selectedDays.join(","));
    }

    if (difficulty) {
      params.set("difficulty", difficulty);
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    router.push(newUrl, { scroll: false });
  }, [selectedDays, difficulty, searchQuery, router]);

  useEffect(() => {
    const filters = {
      days: selectedDays.length > 0 ? selectedDays : undefined,
      difficulty: difficulty || undefined,
      query: searchQuery || undefined,
    };
    onFilterChange(filters);
  }, [selectedDays, difficulty, searchQuery, onFilterChange]);

  return (
    <FilterBarUI
      selectedDays={selectedDays}
      setSelectedDays={setSelectedDays}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      toggleDay={toggleDay}
      resetFilters={() => {
        setSelectedDays([]);
        setDifficulty(null);
        setSearchQuery("");
      }}
    />
  );
}
