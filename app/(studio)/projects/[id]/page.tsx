import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject, listCategories } from '@/lib/data';
import { ProjectForm } from '@/components/ProjectForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getProject((await params).id);
  return { title: p ? p.title : 'Project' };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, categories] = await Promise.all([getProject(id), listCategories()]);
  if (!project) notFound();
  const { id: _id, createdAt: _c, updatedAt: _u, ...initial } = project;
  return (
    <Suspense>
      <ProjectForm key={project.id} project={project} initial={initial} categories={categories} />
    </Suspense>
  );
}
