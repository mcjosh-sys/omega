import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; path: string };
}): Promise<Metadata> {
  const domainData = await getDomainContent(params.domain);
  let metadata: Metadata = {};
  if (domainData) {
    let title = domainData.name;
    const favicon = domainData.favicon;
    const pageData = domainData?.FunnelPages.find(
      (page) =>
        page.pathName.split("/").join("") === params.path.split("/").join("")
    );
    if (pageData)
      title = `${pageData.name ? pageData.name + " | " : ""}${
        domainData.name
      } `;
    metadata = {
      title,
      icons: favicon ? [{ url: favicon, type: "image/x-icon" }] : undefined,
    };
  }
  return metadata;
}

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain);
  const pageData = domainData?.FunnelPages.find(
    (page) =>
      page.pathName.split("/").join("") === params.path.split("/").join("")
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
