import {
  Contact,
  Lane,
  Notification,
  Prisma,
  Tag,
  Ticket,
  User,
} from "@/lib/generated/prisma";
import {
  _getTicketsWithAllRelations,
  getAuthUserDetails,
  getFunnels,
  getMedia,
  getPipelineDetails,
  getTeamMembers,
  getTicketsWithTags,
  getUserPermissions,
} from "@/lib/queries";
import Stripe from "stripe";
import { z } from "zod";

export type NotificationWithUser =
  | (Notification & { User: User })[]
  | undefined;

export type AuthUserDetails = Prisma.PromiseReturnType<
  typeof getAuthUserDetails
>;
// | (User & {
//     Agency:
//       | (Agency & {
//           SidebarOption: AgencySidebarOption[];
//           SubAccount: (SubAccount & {
//             SidebarOption: SubAccountSidebarOption[];
//           })[];
//         })
//       | null;
//     Permissions: Permissions[];
//   })
// | null;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type TeamMember = Exclude<
  Prisma.PromiseReturnType<typeof getTeamMembers>,
  undefined
>[number];

export type SubAccountWithMedia = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput;

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};

export type LaneDetails = Lane & {
  Tickets: TicketAndTags[];
};

export const LaneFormSchema = z.object({
  name: z.string().min(1),
});

export type TicketWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;
const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
});

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketsWithAllRelations
>;

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

export type Address = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: Address;
  name: string;
};

export type StripeCustomerType = {
  email: string;
  name: string;
  shipping: ShippingInfo;
  address: Address;
};

export type PricesList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0];

export type UpsertFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput;

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
});
