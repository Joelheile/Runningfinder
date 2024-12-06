/**
 * @jest-environment jsdom
 */
import React from "react";
import { act, renderHook } from "@testing-library/react";

import { useAddClub } from "@/lib/hooks/clubs/useAddClub";
import { Club } from "@/lib/types/Club";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

global.fetch = jest.fn();

describe("useAddClub", () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const fetchSpy = jest.spyOn(global, "fetch");

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should successfully add a new club", async () => {
    const newClub: Club = {
      name: "Test Club",
      description: "A test club",
      location: { lat: 0, lng: 0 },
      instagramUsername: "testclub",
      memberCount: 0,
      avatarFileId: "",
      avatarUrl: "",
      websiteUrl: "",
      id: "",
      creationDate: "",
      slug: "",
    };

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...newClub, id: "test-id" }),
    } as Response);

    const { result } = renderHook(() => useAddClub(), { wrapper });

    await act(async () => {
      console.log("Calling mutateAsync");
      await result.current.mutateAsync(newClub);
    });

    console.log("result.current:", result.current);

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/clubs",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      })
    );

    expect(result.current.isSuccess).toBe(true);
  });

  it("should handle errors when adding a new club fails", async () => {
    const newClub: Club = {
      name: "Test Club",
      description: "A test club",
      location: { lat: 0, lng: 0 },
      instagramUsername: "testclub",
      memberCount: 0,
      avatarFileId: "",
      avatarUrl: "",
      websiteUrl: "",
      id: "",
      creationDate: "",
      slug: "",
    };

    fetchSpy.mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAddClub(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(newClub)).rejects.toThrow(
        "Failed to add club"
      );
    });

    expect(fetchSpy).toHaveBeenCalledWith("/api/clubs", expect.any(Object));

    expect(result.current.isError).toBe(true);
  });
});
