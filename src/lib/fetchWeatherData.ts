
export const fetchWeatherData = async (lat: number, lng: number, date: Date) => {
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