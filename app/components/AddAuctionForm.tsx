import React, { FC, useState, ChangeEvent, useEffect } from "react";
import { Controller } from "react-hook-form";
import { StatusCode } from "../constants/errorConstants";
import { routes } from "../constants/routesConstants";
import {
  useCreateUpdateAuctionForm,
  CreateUpdateAuctionFields,
} from "../hooks/useCreateUpdateAuction";
import { AuctionType } from "../models/auction";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import ToastWarning from "./ToastWarning";
import Image from "next/image";
import TrashIcon from "@heroicons/react/outline/TrashIcon";

interface Props {
  defaultValues?: AuctionType;
  showAddAuctionsForm: boolean;
  setShowAddAuctionsForm: (showAddAuctions: boolean) => void;
  isUpdateAuction: boolean;
}

const CreateUpdateAuctionForm: FC<Props> = ({
  defaultValues,
  showAddAuctionsForm,
  setShowAddAuctionsForm,
  isUpdateAuction,
}) => {
  const { handleSubmit, errors, control } = useCreateUpdateAuctionForm({
    defaultValues,
  });
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showInputErrorMessage, setShowInputErrorMessage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const errorFields = [
    { field: "title", message: errors.title?.message },
    { field: "description", message: errors.description?.message },
    { field: "start_price", message: errors.start_price?.message },
    { field: "end_date", message: errors.end_date?.message },
    { field: "image", message: fileError ? "Please select an image" : "" },
  ];

  const router = useRouter();

  const firstError = errorFields.find((errorField) => errorField.message);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowInputErrorMessage(false);
    }, 2000); // Set timeout to 2 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showInputErrorMessage]);

  const onSubmit = handleSubmit(async (data: CreateUpdateAuctionFields) => {
    if (!defaultValues) await handleAdd(data);
    else await handleUpdate(data);
    setShowAddAuctionsForm(false);
  });

  const handleAdd = async (data: CreateUpdateAuctionFields) => {
    if (!file) return;
    const response = await API.createAuction(data);
    console.log("response handleAdd:", response);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      // Upload auction image
      const formData = new FormData();
      formData.append("image", file, file.name);
      console.log("file:", file);
      const fileResponse = await API.uploadAuctionImage(
        formData,
        response.data.id
      );
      console.log("file response:", fileResponse);
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message);
        setShowError(true);
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message);
        setShowError(true);
      } else {
        router.push(`${routes.DASHBOARD_PREFIX}`);
      }
    }
  };

  const handleUpdate = async (data: CreateUpdateAuctionFields) => {
    const response = await API.updateAuction(data, defaultValues?.id as string);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      if (!file) {
        router.push(`${routes.DASHBOARD_PREFIX}`);
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
        setApiError(fileResponse.data.message);
        setShowError(true);
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message);
        setShowError(true);
      } else {
        router.push(`${routes.DASHBOARD_PREFIX}`);
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
      console.log("myfile:", myfile);
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

  return (
    <div className="backdrop-blur-sm bg-dark-gray bg-opacity-10 absolute top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center">
      <form onSubmit={onSubmit} className="bg-white p-4 rounded-2xl w-1/3">
        {isUpdateAuction ? (
          <h1 className="font-bold text-2xl mb-4">Edit auction</h1>
        ) : (
          <h1 className="font-bold text-2xl mb-4">Add auction</h1>
        )}
        <div className="mb-3 flex justify-center items-center bg-background rounded-2xl w-full h-48">
          <label
            htmlFor="image"
            className="cursor-pointer rounded-2xl w-full h-full flex justify-center items-center relative"
          >
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
                    }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </div>
                )}
              </>
            ) : (
              <div className="border-2 border-gray-500 px-4 py-2 rounded-2xl">
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
                className={`h-20 rounded-2xl border-2 border-gray-blue${
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
                } mb-3 flex flex-col font-light gap-2`}
              >
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
          {isUpdateAuction ? (<button
            onClick={() => setShowAddAuctionsForm(false)}
            className="px-3 py-2 rounded-2xl bg-gray-blue"
          >
            Discard changes
          </button>) : (<button
            onClick={() => setShowAddAuctionsForm(false)}
            className="px-3 py-2 rounded-2xl bg-gray-blue"
          >
            Cancel
          </button>)}
          {isUpdateAuction ? (
            <button
              className="w-100 px-3 py-2 rounded-2xl bg-dark-gray text-white"
              type="submit"
              onMouseUp={defaultValues ? undefined : handleFileError}
              onClick={() => setShowInputErrorMessage(true)}
            >
              Edit auction
            </button>
          ) : (
            <button
              className="w-100 px-3 py-2 rounded-2xl bg-fluoro-yellow"
              type="submit"
              onMouseUp={defaultValues ? undefined : handleFileError}
              onClick={() => setShowInputErrorMessage(true)}
            >
              Start auction
            </button>
          )}
        </div>
      </form>
      <ToastWarning errorMessage={apiError} showErrorMessage={showError} />
      {firstError && (
        <ToastWarning
          key={firstError.field}
          errorMessage={firstError.message}
          showErrorMessage={showInputErrorMessage}
        />
      )}
    </div>
  );
};

export default CreateUpdateAuctionForm;
