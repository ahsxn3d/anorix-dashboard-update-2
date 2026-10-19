import type { Metadata } from 'next';
import { Suspense } from 'react';
import { listCategories } from '@/lib/data';
import { EMPTY_PROJECT } from '@/lib/projects';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/ProjectForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New project' };

export default async function NewProjectPage() {
  const [categories, last] = await Promise.all([
    listCategories(),
    prisma.deploymentProduct.aggregate({ _max: { displayOrder: true } }),
  ]);
  const initial = { ...EMPTY_PROJECT, displayOrder: (last._max.displayOrder ?? -1) + 1 };
  return (
    <Suspense>
      <ProjectForm initial={initial} categories={categories} />
    </Suspense>
  );
}
