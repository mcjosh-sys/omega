import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain);
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === params.path
  );

  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
      favicon={domainData.favicon}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
