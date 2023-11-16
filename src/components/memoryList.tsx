import Link from "next/link";
import { Image } from "cloudinary-react";
import { MemoriesQuery_memories } from "src/generated/MemoriesQuery";

interface IProps {
  memories: MemoriesQuery_memories[];
  setHighlightedId: (id: string | null) => void;
}

export default function MemoryList({ memories, setHighlightedId }: IProps) {
  return (
    <>
      {memories.map((memory) => (
        <Link key={memory.id} href={`/memories/${memory.id}`}>
          <div
            className="px-6 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => setHighlightedId(memory.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full md:w-full">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={memory.publicId}
                alt={memory.message}
                secure
                dpr="auto"
                quality="auto"
                width={700}
                height={Math.floor((9 / 16) * 700)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-full sm:pl-0">
              <h5 className="text-md py-3">{memory.message}</h5>
              {/* <p>{memory.hearts} ❤️</p> */}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
