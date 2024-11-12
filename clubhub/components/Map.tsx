"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import FilterBar from "./FilterBar";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import SelectedClubHeader from "./Clubs/SelectedClubHeader";

interface Location {
  id: string;
  name: string;
  description: string;
  position: { lat: number; lng: number };
  date: string;
  time: string;
  distance: string;
  image: string;
  instagram: string;
  website: string;
}

const locations: Location[] = [
  {
    id: "1",
    name: "Midnight Runners Berlin",
    description: "",
    position: { lat: 52.5257694, lng: 13.3935091 },
    date: "Wednesday",
    time: "19:00",
    distance: "5km",
    image: "../assets/midnightrunners.jpeg", //TODO: Images
    instagram: "https://www.instagram.com/midnightrunnersberlin/",
    website: "https://www.midnightrunners.com/cities/berlin",
  },

  {
    id: "2",
    name: "forward run club berlin",
    description: "Running forward through Berlin",
    position: { lat: 52.5410841, lng: 13.4122118 },
    date: "Sunday coffee run",
    time: "10:00h",
    distance: "10km",
    image:
      "https://scontent-ber1-1.cdninstagram.com/v/t51.2885-19/448115379_439007129086862_6972361061642885259_n.jpg?_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=YPija2vtruoQ7kNvgH1gQC2&edm=AFg4Q8wBAAAA&ccb=7-5&oh=00_AYC9Dz8Pffvrl5adDKpQcAyjndcbQKOROr9ks5CxxE4Vxw&oe=66DAB65B&_nc_sid=0b30b7",
    instagram: "https://www.instagram.com/forwardrunningbln/",
    website: "",
  },
  {
    id: "3",
    name: "Adidas Runners Berlin",
    description: `MO 7PM - social run
TUE 7PM - tempo tuesdays
THU 7PM - track session
SUN 9AM - long run road to`,
    position: { lat: 52.49802922714861, lng: 13.450062075707867 },
    date: "Monday, Tuesday, Thursday, Sunday",
    time: "9:00h, 19:00h",
    distance: "5km",
    image:
      "https://scontent-ber1-1.cdninstagram.com/v/t51.288…NCMCI1zWFyMF6EbKyARJMA&oe=66DAA382&_nc_sid=0b30b7",
    instagram: "https://www.instagram.com/runnersberlin/",
    website: "https://linktr.ee/adidasrunnersberlin",
  },
  {
    id: "4",
    name: "Croissant Run Club",
    description: `Meet at Dussman & finish with pastry at Albatross bakery`,
    position: { lat: 52.49802922714861, lng: 13.450062075707867 },
    date: "Sunday",
    time: "10:30h",
    distance: "5km",
    image:
      "https://scontent-ber1-1.cdninstagram.com/v/t51.288…NCMCI1zWFyMF6EbKyARJMA&oe=66DAA382&_nc_sid=0b30b7",
    instagram: "https://www.instagram.com/runnersberlin/",
    website: "https://linktr.ee/adidasrunnersberlin",
  },
];

/*
#berlin.runners
crossantrunclubberlin
berlin.runners (women running collective)
mrc_berlin (mikkeller running club berlin)
berlin_weekend_runners
berlin_social_runners
run.berlin.run
berlin_running
runpackberlin
berlin_runners_all_you_can_run
blackwomenrunberlin
ktb.runclub (korea town berlin run club)
mallofberlinrun
therollingmile (Fitness & Running Club)
runningorder.berlin
stillwerunbln (Black Flinta* run Berlin)
thunder.runners.berlin
morningrunberlin
berliner.run
gegenrunningclub (Liht Exercise // Heavy Lifestyle)
fylingeaglesrunning
berlinrunningclub

@loadberlin
6km, 6:30min/km
📍Lacoste concept store Mitte, 7:00 pm

@houseofhealingberlin
5.5km, 6:45 km/min
📍House Of Healing Charlottenburg, 6:45 pm
Booked via @urbansportsclub

@adidasrunners @runnersberlin
8km, 4:45-6:30 min/km
📍Adidas Sports Base, 7:00 pm

@paceberlin_
Track Session
📍Mauerpark, 7:30 pm

Tuesday
@division.bpm
Open Track
📍Maybachufer, 7:30 am

@mrc_berlin
Track Tuesday
📍Mikkeller, 6:30 pm

@adidasrunners @runnersberlin
Tempo Tuesday
📍Stadium “Wulle”, 6:45 pm

@kraftrunners
Intervals
📍Kraftraum, 7:00 pm

@lululemoneurope @ramona__tyler
7km, 6:35-7 min/km
📍Lululemon Store Mitte, 6:30 pm

WEDNESDAY:
@gegenrunningclub
6km, 6:30 min/km
📍Tempelhofer Feld, 6:30 pm

@flatmountainliving
5-7km, 6:30 min/km
📍Flat Mountain Living Store, 7:00 pm

@midnightrunnersberlin
10km Bootcamp, 4-6 min/km
📍Generator Hostel, 7:00 pm

THURSDAY:
@run_n_rave
20 min run + workout
📍House Of Color, 7:00 am

@on
8km, 5:30-6 min/km
6km, 6:30-7 min/km
📍On Store Berlin Mitte, 6:15 pm

@adidasrunners @runnersberlin
Track Thursday
📍Stadium “Wulle”, 6:45 pm

@flatmountainliving
6-7km, 6:30 min/km
📍 Flat Mountain Living Store, 7:00 pm

@paceberlin_
6-7km social run, for FLINTA* athletes
📍Südblock, 7:30 pm

Saturday
Adidas City Night
5-10km

@optimisticrunners
6km, 6:30 min/km
📍Optimistic Runners (Torstr. 62), 9:00 am

@houseofhealingberlin
5.5km, 6:45km/min
📍House Of Healing Charlottenburg, 10:00 am
Booked via @urbansportsclub

@hagius
6km, 7km/min
📍Château Royal, 9:00 am

@mrc_berlin
7km, Easy Pace
📍Mikkeller Berlin

@forwardrunningbln
Shake-Out Run + Pizza
4-5km, Easy Pace
📍U Eberswalderstr, 7:30 pm

Sunday
@division.bpm
10km, 5-5:30 min/km
📍 Isla Coffee, 9:00 am

@catosport
7km, 6:30 min/km
📍LAP Coffee, 10:00 am

@girlbrunchrun
7km, 7 min/km
📍TBA, 10:00 am

@cndo.club
5-7km, 6:30 min/km
📍 Kastanienallee 24, 11:00 am

@paceberlin_
7km Social Run & Brunch, 6:45 min/k pace
📍Lonely Hearts Cafe, 11:00 am
*/

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      const { InfoWindow } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current as HTMLDivElement, {
        center: locations[0].position,
        zoom: 10,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      locations.forEach((location) => {
        const marker = new Marker({
          map,
          position: location.position,
          title: location.name,
        });

        marker.addListener("click", () => {
          setSelectedLocation(location);
        });
      });

      // Fit the map to show all markers
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => bounds.extend(location.position));
      map.fitBounds(bounds);
    };

    initMap();
  }, []);

  return (
    <div className="h-screen w-full">
      {selectedLocation && (
        <SelectedClubHeader
          id={selectedLocation.id}
          name={selectedLocation.name}
          description={selectedLocation.description}
        />
      )}

      <div className="h-full w-full" ref={mapRef} />
    </div>
  );
}
