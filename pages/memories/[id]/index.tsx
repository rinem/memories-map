import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import MemoryNav from "src/components/memoryNav";
import SingleMap from "src/components/singleMap";
import {
  ShowMemoryQuery,
  ShowMemoryQueryVariables,
} from "src/generated/ShowMemoryQuery";

const SHOW_memory_QUERY = gql`
  query ShowMemoryQuery($id: String!) {
    memory(id: $id) {
      id
      userId
      message
      publicId
      hearts
      latitude
      longitude
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function ShowMemory() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <MemoryData id={id as string} />;
}

function MemoryData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowMemoryQuery, ShowMemoryQueryVariables>(
    SHOW_memory_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.memory)
    return <Layout main={<div>Unable to load memory {id}</div>} />;

  const { memory } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4 mt-5">
            <MemoryNav memory={memory} />

            <h4 className="text-lg my-2 mr-3">{memory.message}</h4>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={memory.publicId}
              alt={memory.message}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            {/* <p>{memory.hearts} ❤️</p> */}
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap memory={memory} nearby={memory.nearby} />
          </div>
        </div>
      }
    />
  );
}
