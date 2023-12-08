import { yupResolver } from "@hookform/resolvers/yup";
import { AuctionType } from "../models/auction";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface CreateUpdateAuctionFields {
  title: string;
  description: string;
  start_price: number;
  end_date: string;
}

interface Props {
  defaultValues?: AuctionType;
}

export const useCreateUpdateAuctionForm = ({ defaultValues }: Props) => {
  const CreateUpdateAuctionSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    start_price: Yup.number().required("Start price is required"),
    end_date: Yup.string()
      .test("isFuture", "End date can't be in the past", function (value) {
        const today = new Date();
        const todayAsString = today.toISOString();
        return value >= todayAsString;
      })
      .required("End date is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      end_date: "",
      ...defaultValues,
    },
    mode: "onSubmit",
    resolver: yupResolver(CreateUpdateAuctionSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type CreateUpdateAuctionForm = ReturnType<
  typeof useCreateUpdateAuctionForm
>;
