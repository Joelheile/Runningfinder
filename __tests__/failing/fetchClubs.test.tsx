/**
 * @jest-environment jsdom
 */
import React from "react";
import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  fetchMock.resetMocks();
});

test("fetches clubs successfully", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      {
        id: "65ddcd2b-c86a-4046-b660-f035e829568b",
        name: "YFN Running Club",
        slug: "yfn-running-club",
        description:
          "Are you ready to get in shape again? Let's run together and create awesome memories!",
        locationLng: "0",
        locationLat: "0",
        instagramUsername: "youngfounders.network",
        websiteUrl: "https://youngfounders.network/",
        avatarUrl:
          "https://runningfinder.s3.eu-central-1.amazonaws.com/1731529930534-YFN%20Square%20%282%29.png",
        location: {
          lat: 0,
          lng: 0,
        },
      },
    ])
  );

  const { result } = renderHook(() => useFetchClubs(), { wrapper });
  console.log(result.current.status);
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toContainEqual({
    id: "65ddcd2b-c86a-4046-b660-f035e829568b",
    name: "YFN Running Club",
    slug: "yfn-running-club",
    description:
      "Are you ready to get in shape again? Let's run together and create awesome memories!",
    locationLng: "0",
    locationLat: "0",
    instagramUsername: "youngfounders.network",
    websiteUrl: "https://youngfounders.network/",
    avatarUrl:
      "https://runningfinder.s3.eu-central-1.amazonaws.com/1731529930534-YFN%20Square%20%282%29.png",
    location: {
      lat: 0,
      lng: 0,
    },
  });
});
