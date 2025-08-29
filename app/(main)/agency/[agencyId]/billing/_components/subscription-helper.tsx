"use client";
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { Plan } from "@/lib/generated/prisma";
import { useModal } from "@/providers/modal-provider";
import { PricesList } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};

const SubscriptionHelper = ({ prices, customerId, planExists }: Props) => {
  const plan = useSearchParams().get("plan");
  const { setOpen } = useModal();

  useEffect(() => {
    plan &&
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subHeading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? (plan as Plan) : "",
            plans: prices,
          },
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);
  return null;
};

export default SubscriptionHelper;
