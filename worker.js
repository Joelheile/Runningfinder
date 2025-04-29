async function parseJavaScriptData(html) {
  try {
    const pattern = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/g;
    const matches = [...html.matchAll(pattern)];

    const events = [];

    for (const match of matches) {
      try {
        const data = decodeURIComponent(JSON.parse(`"${match[1]}"`));

        const eventEntries = data.matchAll(/\d+:\{([^}]+)\}/g);

        for (const entry of eventEntries) {
          try {
            let jsonStr = "{" + entry[1] + "}";

            jsonStr = jsonStr.replace(/([{,])\s*([a-zA-Z]+):/g, '$1"$2":');
            const eventData = JSON.parse(jsonStr);

            const datetimeString = `${eventData.date} ${eventData.time}`;
            const datetime = new Date(datetimeString);

            const distanceString = eventData.distance
              .replace("km", "")
              .replace(" km", "")
              .replace("N/A", "0")
              .replace(" ", "");

            const instagramString = eventData.instagram
              ? eventData.instagram
                  .replace("https://www.instagram.com/", "")
                  .replace("/", "")
              : "";
            const stravaString = eventData.strava
              ? eventData.strava
                  .replace("https://www.strava.com/clubs/", "")
                  .replace("/", "")
              : "";

            // Format the event data
            const formattedEvent = {
              eventName: eventData.name,
              clubName: eventData.club,
              datetime: datetime.toISOString(),
              location: eventData.location,
              locationUrl: eventData.locationURL,
              difficulty: eventData.difficulty,
              distance: distanceString,
              isRecurrent: eventData.isRecurrent,
              location_latitude: eventData.locationLatitude,
              location_longitude: eventData.locationLongitude,
              instagramUsername: instagramString,
              stravaUsername: stravaString,
            };

            events.push(formattedEvent);
          } catch (error) {
            console.error("Error parsing individual event:", error);
          }
        }
      } catch (error) {
        console.error("Error processing JavaScript match:", error);
      }
    }

    console.log("Total events parsed:", events.length);
    return events;
  } catch (error) {
    console.error("Error parsing JavaScript data:", error);
    return [];
  }
}

async function fetchAndParseEvents() {
  try {
    const response = await fetch("https://runningfomo.com");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log("Fetched HTML length:", html.length);

    // Parse JavaScript data
    const events = await parseJavaScriptData(html);

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

async function extractCoordinates(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const finalUrl = response.url;
    console.log("Final URL:", finalUrl);

    const patterns = [
      {
        regex: /\/search\/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/,
        extract: (match) => ({ latitude: match[1], longitude: match[2] }),
      },
      {
        regex: /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        extract: (match) => ({ latitude: match[1], longitude: match[2] }),
      },
      {
        regex: /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        extract: (match) => ({ latitude: match[1], longitude: match[2] }),
      },
    ];

    for (const pattern of patterns) {
      const match = finalUrl.match(pattern.regex);
      if (match) {
        return pattern.extract(match);
      }
    }

    throw new Error("No coordinates found in URL");
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    throw error;
  }
}

async function handleLocationRequest(request) {
  try {
    const url = new URL(request.url);
    const locationUrl = url.searchParams.get("url");

    if (!locationUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing URL parameter",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const coordinates = await extractCoordinates(locationUrl);
    return new Response(JSON.stringify(coordinates), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
      },
    });
  }

  const url = new URL(request.url);

  if (url.pathname === "/location") {
    return handleLocationRequest(request);
  }

  try {
    const events = await fetchAndParseEvents();

    if (events.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No events found",
          message: "Could not find any running events",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return new Response(JSON.stringify(events), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export default {
  fetch: handleRequest,
};
