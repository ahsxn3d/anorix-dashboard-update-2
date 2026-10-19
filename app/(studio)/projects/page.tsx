import type { Metadata } from 'next';
import Link from 'next/link';
import { listProjects } from '@/lib/data';
import { BlurTitle } from '@/components/BlurTitle';
import { ProjectsBoard } from '@/components/ProjectsBoard';
import { IPlus } from '@/components/Icons';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await listProjects();
  const published = projects.filter((p) => p.isPublished).length;
  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow rise">(01) Projects</span>
          <BlurTitle text="Projects & deployments" serif={['&', 'deployments']} />
          <p className="lede rise" style={{ '--i': 3 } as React.CSSProperties}>
            {projects.length} in the catalog, {published} live on the main site. Same order as the site: lowest number first.
          </p>
        </div>
        <Link href="/projects/new" className="btn rise" data-magnetic style={{ '--i': 4 } as React.CSSProperties} data-testid="new-project">
          New project <span className="ic"><IPlus size={14} /></span>
        </Link>
      </div>
      <ProjectsBoard projects={projects} />
    </>
  );
}
