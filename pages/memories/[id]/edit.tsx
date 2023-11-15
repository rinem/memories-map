import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import MemoryForm from "src/components/memoryForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditMemoryQuery,
  EditMemoryQueryVariables,
} from "src/generated/EditMemoryQuery";

const EDIT_memory_QUERY = gql`
  query EditMemoryQuery($id: String!) {
    memory(id: $id) {
      id
      userId
      message
      image
      publicId
      hearts
      latitude
      longitude
    }
  }
`;

export default function EditMemory() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <MemoryData id={id as string} />;
}

function MemoryData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<EditMemoryQuery, EditMemoryQueryVariables>(
    EDIT_memory_QUERY,
    { variables: { id } }
  );

  if (!user) return <Layout main={<div>Please login</div>} />;
  if (loading) return <Layout main={<div>loading...</div>} />;
  if (data && !data.memory)
    return <Layout main={<div>Unable to load memory</div>} />;
  if (user.uid !== data?.memory?.userId)
    return <Layout main={<div>You don't have permission</div>} />;

  return <Layout main={<MemoryForm memory={data.memory} />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};
