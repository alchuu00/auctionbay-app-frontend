import React, { FC, useState, ChangeEvent, useEffect } from "react";
import { Controller } from "react-hook-form";
import * as API from "../../../src/api/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { StatusCode } from "@/src/constants/errorConstants";
import {
  useCreateUpdateAuctionForm,
  CreateUpdateAuctionFields,
} from "@/src/hooks/useCreateUpdateAuction";
import { AuctionType } from "@/src/models/auction";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

interface Props {
  refetchAuctions: () => void;
  defaultValues?: AuctionType;
  setShowAddAuctionsForm: (showAddAuctions: boolean) => void;
  isUpdateAuction: boolean;
}

const CreateUpdateAuctionForm: FC<Props> = ({
  refetchAuctions,
  defaultValues,
  setShowAddAuctionsForm,
  isUpdateAuction,
}) => {
  const { handleSubmit, errors, control } = useCreateUpdateAuctionForm({
    defaultValues,
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

useEffect(() => { 
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
}, [errors]);

  const router = useRouter();

  const onSubmit = handleSubmit(async (data: CreateUpdateAuctionFields) => {
    if (!defaultValues) await handleAdd(data);
    else await handleUpdate(data);
    refetchAuctions();
    setShowAddAuctionsForm(false);
  });

  const handleAdd = async (data: CreateUpdateAuctionFields) => {
    if (!file) return null;
    const response = await API.createAuction(data);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      toast.error(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      toast.error(response.data.message);
    } else {
      // Upload auction image
      const formData = new FormData();
      formData.append("image", file, file.name);
      const fileResponse = await API.uploadAuctionImage(
        formData,
        response.data.id
      );
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        toast.error(fileResponse.data.message);
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        toast.error(fileResponse.data.message);
      } else {
        toast.success("Auction item created successfully");
      }
    }
  };

  const handleUpdate = async (data: CreateUpdateAuctionFields) => {
    const response = await API.updateAuction(data, defaultValues?.id as string);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      toast.error(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      toast.error(response.data.message);
    } else {
      toast.success("Auction item updated successfully");
      if (!file) {
        router.push(`/auctions/my`);
        return;
      }
      // Upload auction image
      const formData = new FormData();
      formData.append("image", file, file.name);
      const fileResponse = await API.uploadAuctionImage(
        formData,
        response.data.id
      );
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        toast.error(fileResponse.data.message);
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        toast.error(fileResponse.data.message);
      }
    }
  };

  const handleFileError = () => {
    if (!file) setFileError(true);
    else setFileError(false);
  };

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files.length > 0) {
      const myfile = target.files[0];
      setFile(myfile);
      // set image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(myfile);
    }
  };

  useEffect(() => {
    // When the component is mounted, add a rule to the body to hide the scrollbar
    document.body.style.overflow = "hidden";

    // When the component is unmounted, remove the rule from the body to show the scrollbar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (defaultValues?.image) {
      setImagePreview(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${defaultValues.image}`
      );
    }
  }, [defaultValues]);

  return (
    <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded-2xl lg:h-fit lg:w-1/3 w-3/4">
        {isUpdateAuction ? (
          <h1 className="font-bold text-2xl mb-4">Edit auction</h1>
        ) : (
          <h1 className="font-bold text-2xl mb-4">Add auction</h1>
        )}
        <div className="mb-3 flex justify-center items-center bg-background rounded-2xl w-full h-48">
          <label
            htmlFor="image"
            className="cursor-pointer rounded-2xl w-full h-full flex justify-center items-center relative">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Selected Image"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full rounded-2xl"
                />
                {imagePreview && (
                  <div
                    className="bg-white rounded-md top-5 right-5 absolute px-2 py-1"
                    onClick={() => {
                      setImagePreview(null);
                      setFile(null);
                    }}>
                    <TrashIcon className="w-5 h-5 hover:drop-shadow-md" />
                  </div>
                )}
              </>
            ) : (
              <div className="border-2 border-gray-500 px-4 py-2 rounded-2xl hover:drop-shadow-md">
                Add image
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <div className="mb-3 flex flex-col font-light gap-2">
              <label htmlFor="title">Title</label>
              <input
                {...field}
                name="title"
                id="title"
                placeholder="Write item name here"
                type="text"
                aria-label="Title"
                aria-describedby="title"
                className={`rounded-2xl border-2 border-gray-blue ${
                  errors.title ? "form-control is-invalid" : "form-control"
                }`}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <div className="mb-3 flex flex-col font-light gap-2 relative">
              <label htmlFor="description">Description</label>
              <textarea
                {...field}
                value={field.value}
                name="description"
                id="description"
                placeholder="Write description here..."
                aria-label="Description"
                aria-describedby="description"
                className={`h-20 rounded-2xl border-2 border-gray-blue ${
                  errors.description
                    ? "form-control is-invalid"
                    : "form-control"
                }`}
              />
            </div>
          )}
        />
        <div className="flex gap-4">
          {!isUpdateAuction && (
            <Controller
              control={control}
              name="start_price"
              render={({ field }) => (
                <div className="mb-3 flex flex-col w-1/2 font-light gap-2 relative">
                  <label htmlFor="start_price">Start price</label>
                  <input
                    {...field}
                    value={field.value}
                    name="start_price"
                    id="start_price"
                    placeholder="Price"
                    type="number"
                    aria-label="Start Price"
                    aria-describedby="start price"
                    className={`rounded-2xl border-2 border-gray-blue ${
                      errors.start_price
                        ? "form-control is-invalid"
                        : "form-control"
                    }`}
                  />
                  <span className="absolute top-10 right-3 text-gray-500 pointer-events-none">
                    €
                  </span>
                </div>
              )}
            />
          )}
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <div
                className={`${
                  isUpdateAuction ? "w-full" : "w-1/2"
                } mb-3 flex flex-col font-light gap-2`}>
                <label htmlFor="end_date">End date</label>
                <input
                  {...field}
                  value={field.value}
                  name="end_date"
                  id="end_date"
                  type="date"
                  aria-label="End Date"
                  aria-describedby="end date"
                  className={`rounded-2xl border-2 border-gray-blue ${
                    errors.end_date ? "form-control is-invalid" : "form-control"
                  }`}
                />
              </div>
            )}
          />
        </div>
        <div className="flex gap-4 justify-end">
          {isUpdateAuction ? (
            <button
              onClick={() => setShowAddAuctionsForm(false)}
              className="px-3 py-2 rounded-2xl bg-gray-blue hover:drop-shadow-md">
              Discard changes
            </button>
          ) : (
            <button
              onClick={() => setShowAddAuctionsForm(false)}
              className="px-3 py-2 rounded-2xl bg-gray-blue hover:drop-shadow-md">
              Cancel
            </button>
          )}
          {isUpdateAuction ? (
            <button
              className="w-100 px-3 py-2 rounded-2xl bg-dark-gray text-white hover:drop-shadow-md"
              type="submit"
              onMouseUp={defaultValues ? undefined : handleFileError}>
              Edit auction
            </button>
          ) : (
            <button
              className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow hover:drop-shadow-md"
              type="submit"
              onMouseUp={defaultValues ? undefined : handleFileError}>
              Start auction
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateAuctionForm;
