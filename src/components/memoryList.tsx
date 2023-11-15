import Link from "next/link";
import { Image } from "cloudinary-react";
import { MemorysQuery_memories } from "src/generated/MemorysQuery";

interface IProps {
  memories: MemorysQuery_memories[];
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
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={memory.publicId}
                alt={memory.message}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{memory.message}</h2>
              <p>{memory.hearts} 🛌 memory</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
