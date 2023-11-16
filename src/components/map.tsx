import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import mapboxgl from 'mapbox-gl';

import { useLocalState } from "src/utils/useLocalState";
import { MemorysQuery_memories } from "src/generated/MemorysQuery";
// import { SearchBox } from "./searchBox";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
interface IProps {
  setDataBounds: (bounds: string) => void;
  memories: MemorysQuery_memories[];
  highlightedId: string | null;
}

export default function Map({ setDataBounds, memories, highlightedId }: IProps) {
  const [selected, setSelected] = useState<MemorysQuery_memories | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 28.63,
    longitude: 77.21,
    zoom: 10,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport({ ...nextViewport })}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onLoad={async () => {
          if (mapRef.current) {
            const bounds = await mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        onInteractionStateChange={async (extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = await mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        {/* <div className="absolute top-0 w-full z-10 p-4"> */}
          {/* <SearchBox
            defaultValue=""
            onSelectMessage={async (_address, latitude, longitude) => {
              if (latitude && longitude) {
                setViewport((old) => ({
                  ...old,
                  latitude,
                  longitude,
                  zoom: 12,
                }));
                if (mapRef.current) {
                  const bounds = await mapRef.current.getMap().getBounds();
                  setDataBounds(JSON.stringify(bounds.toArray()));
                }
              }
            }}
          />
        </div> */}

        {memories.map((memory) => (
          <Marker
            key={memory.id}
            latitude={memory.latitude}
            longitude={memory.longitude}
            offsetLeft={-15}
            offsetTop={-15}
            className={highlightedId === memory.id ? "marker-active" : ""}
          >
            <button
              style={{ width: "30px", height: "30px", fontSize: "30px" }}
              type="button"
              onClick={() => setSelected(memory)}
            >
              <img
                src={
                  highlightedId === memory.id
                    ? "/heart-color.svg"
                    : "/heart-solid.svg"
                }
                alt="memory"
                className="w-8"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4">{selected.message.substr(0, 30)}</h3>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/memories/${selected.id}`}>
                <a>View Memory</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
