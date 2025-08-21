import { db } from '@/lib/db'
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const domainData = await getDomainContent(params.domain);
  if(domainData){
    return {
      title: domainData.name,
    };
  }
  return {}
}

const Page = async ({ params }: { params: { domain: string } }) => {
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
      favicon={domainData.favicon}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        liveMode={true}
      />
    </EditorProvider>
  )
}


export default Page
