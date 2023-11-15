import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  CreateMemoryMutation,
  CreateMemoryMutationVariables,
} from "src/generated/CreateMemoryMutation";
import {
  UpdateMemoryMutation,
  UpdateMemoryMutationVariables,
} from "src/generated/UpdateMemoryMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_memory_MUTATION = gql`
  mutation CreateMemoryMutation($input: MemoryInput!) {
    createMemory(input: $input) {
      id
    }
  }
`;

const UPDATE_memory_MUTATION = gql`
  mutation UpdateMemoryMutation($id: String!, $input: MemoryInput!) {
    updateMemory(id: $id, input: $input) {
      id
      image
      publicId
      latitude
      longitude
      hearts
      message
    }
  }
`;

interface IUploadImageResponse {
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  return response.json();
}

interface IFormData {
  message: string;
  latitude: number;
  longitude: number;
  hearts: string;
  image: FileList;
}

interface IMemory {
  id: string;
  message: string;
  latitude: number;
  longitude: number;
  hearts: number;
  image: string;
  publicId: string;
}

interface IProps {
  memory?: IMemory;
}

export default function MemoryForm({ memory }: IProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({
    defaultValues: memory
      ? {
          message: memory.message,
          latitude: memory.latitude,
          longitude: memory.longitude,
          hearts: memory.hearts.toString(),
        }
      : {},
  });
  const message = watch("message");
  const [createSignature] = useMutation<CreateSignatureMutation>(
    SIGNATURE_MUTATION
  );
  const [createMemory] = useMutation<
    CreateMemoryMutation,
    CreateMemoryMutationVariables
  >(CREATE_memory_MUTATION);
  const [updateMemory] = useMutation<
    UpdateMemoryMutation,
    UpdateMemoryMutationVariables
  >(UPDATE_memory_MUTATION);

  useEffect(() => {
    register({ name: "message" }, { required: "Please enter your address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const { data: memoryData } = await createMemory({
        variables: {
          input: {
            message: data.message,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            hearts: parseInt(data.hearts, 10),
          },
        },
      });

      if (memoryData?.createMemory) {
        router.push(`/memories/${memoryData.createMemory.id}`);
      }
    }
  };

  const handleUpdate = async (currentMemory: IMemory, data: IFormData) => {
    let image = currentMemory.image;

    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(
          data.image[0],
          signature,
          timestamp
        );
        image = imageData.secure_url;
      }
    }

    const { data: memoryData } = await updateMemory({
      variables: {
        id: currentMemory.id,
        input: {
          message: data.message,
          image: image,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          hearts: parseInt(data.hearts, 10),
        },
      },
    });

    if (memoryData?.updateMemory) {
      router.push(`/memories/${currentMemory.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(false);
    if (!!memory) {
      handleUpdate(memory, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {memory ? `Editing ${memory.message}` : "Add a New Memory"}
      </h1>

      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your location
        </label>
        <SearchBox
          onSelectMessage={(message, latitude, longitude) => {
            setValue("message", message);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue={memory ? memory.message : ""}
        />
        {errors.message && <p>{errors.message.message}</p>}
      </div>

      {message && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (memory || fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            ) : memory ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={memory.publicId}
                alt={memory.message}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                crop="fill"
                gravity="auto"
              />
            ) : null}
            {errors.image && <p>{errors.image.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="hearts" className="block">
              Beds
            </label>
            <input
              id="hearts"
              name="hearts"
              type="number"
              className="p-2"
              ref={register({
                required: "Please enter the number of hearts",
                max: { value: 10, message: "Wooahh, too lovely of a memory" },
                min: { value: 1, message: "Must have at least 1 heart" },
              })}
            />
            {errors.hearts && <p>{errors.hearts.message}</p>}
          </div>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{" "}
            <Link href={memory ? `/memories/${memory.id}` : "/"}>
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
