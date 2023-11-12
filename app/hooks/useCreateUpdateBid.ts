import { yupResolver } from "@hookform/resolvers/yup";
import { use } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface CreateUpdateBidFields {
  bid: number;
}

interface FormData {
  bid: number;
}

interface Props {
  defaultValues?: CreateUpdateBidFields;
}

export const useCreateUpdateBidFields = ({ defaultValues }: Props) => {
  const PlaceBidSchema = Yup.object().shape({
    bid: Yup.number().required("Bid is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues: {
      bid: 0,
      ...defaultValues,
    },
    mode: "onSubmit",
    resolver: yupResolver(PlaceBidSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type PlaceBidForm = ReturnType<typeof useCreateUpdateBidFields>;
