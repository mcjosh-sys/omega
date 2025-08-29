import { db } from '@/lib/db'
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { domain: string; path: string };
}): Promise<Metadata> {
  const domainData = await getDomainContent(params.domain);
  let metadata: Metadata = {}
  if (domainData) {
    let title = domainData.name
    const favicon = domainData.favicon
    const pageData = domainData?.FunnelPages.find(
      (page) => page.pathName === params.path
    );
    if (pageData)
      title = `${pageData.name ? pageData.name + " | " : ""}${
        domainData.name
      } `;
    metadata = {
      title,
      icons: favicon
        ? [{ url: favicon, type: "image/x-icon" }]
        : undefined,
    };
  }
  return metadata;
}

const Page = async (props: { params: Promise<{ domain: string }> }) => {
  const params = await props.params;
  const domainData = await getDomainContent(params.domain)
  if (!domainData) return notFound()

  const pageData = domainData.FunnelPages.find((page) => !page.pathName)

  if (!pageData) return notFound()

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  })

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        liveMode={true}
      />
    </EditorProvider>
  )
}

export default Page
