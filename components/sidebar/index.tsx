import { getAuthUserDetails } from "@/lib/queries";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  if (!user.Agency) return;

  const agencyDetails = user.Agency;
  const subaccountDetails = user.Agency.SubAccount.find(
    (subaccount) => subaccount.id === id
  );

  const details = type === "agency" ? agencyDetails : subaccountDetails;

  const isWhiteLabelAgency = agencyDetails.whiteLabel;

  if (!details) return;

  let sidebarLogo =
    isWhiteLabelAgency || type === "agency"
      ? agencyDetails.agencyLogo
      : subaccountDetails?.subAccountLogo || "/assets/omega-logo.png";

  const sidebarOpt =
    type === "agency"
      ? agencyDetails.SidebarOption ?? []
      : subaccountDetails?.SidebarOption ?? [];

  const subaccounts = agencyDetails.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpt}
        subaccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpt}
        subaccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
