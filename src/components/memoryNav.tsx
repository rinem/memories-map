import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteMemory, DeleteMemoryVariables } from "src/generated/DeleteMemory";

const DELETE_MUTATION = gql`
  mutation DeleteMemory($id: String!) {
    deleteMemory(id: $id)
  }
`;

interface IProps {
  memory: {
    id: string;
    userId: string;
  };
}

export default function MemoryNav({ memory }: IProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = !!user && user.uid === memory.userId;
  const [deleteMemory, { loading }] = useMutation<
    DeleteMemory,
    DeleteMemoryVariables
  >(DELETE_MUTATION);

  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/memories/${memory.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteMemory({ variables: { id: memory.id } });
                router.push("/");
              }
            }}
          >
            delete
          </button>
        </>
      )}
    </>
  );
}
