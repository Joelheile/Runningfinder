"use client"
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Map() {

const mapRef = React.useRef<HTMLDivElement>(null)

useEffect(() => {
    const initMap = async () => {

        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
            version: "weekly"
        })

        const {Map} = await loader.importLibrary("maps");
    
        const position = {
            lat: 52.5206301,
            lng: 13.4083387
        }
     
        // map options
        const mapOptions: google.maps.MapOptions= {
            center: position,
            zoom: 17,
            mapId: "55c1e732e0359b58"
        }

        // setup the map
        const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

    }
    initMap()
},[])

    return (
        <div className="h-screen" ref={mapRef} />
    );
}