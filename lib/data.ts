import type { DeploymentProduct } from '@prisma/client';
import { prisma } from './prisma';
import { AUTHORIZED_EMAIL } from './constants';
import type { ProjectView } from './projects';

export function toView(d: DeploymentProduct): ProjectView {
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    client: d.client,
    year: d.year,
    category: d.category,
    badge: d.badge,
    type: d.type,
    status: d.status,
    shortDescription: d.shortDescription,
    fullDescription: d.fullDescription,
    thumbnailUrl: d.thumbnailUrl,
    coverImageUrl: d.coverImageUrl,
    previewVideoUrl: d.previewVideoUrl,
    demoUrl: d.demoUrl,
    liveUrl: d.liveUrl,
    githubUrl: d.githubUrl,
    appLaunchUrl: d.appLaunchUrl,
    rating: d.rating,
    fpsBenchmark: d.fpsBenchmark,
    auditScore: d.auditScore,
    tags: d.tags ?? [],
    techStack: d.techStack ?? [],
    features: d.features ?? [],
    isFeatured: d.isFeatured,
    isPublished: d.isPublished,
    displayOrder: d.displayOrder,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

/** Same ordering the main site uses. */
export async function listProjects(): Promise<ProjectView[]> {
  const rows = await prisma.deploymentProduct.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }] });
  return rows.map(toView);
}

export async function getProject(id: string): Promise<ProjectView | null> {
  const row = await prisma.deploymentProduct.findUnique({ where: { id } });
  return row ? toView(row) : null;
}

export async function listCategories(): Promise<string[]> {
  const rows = await prisma.deploymentProduct.findMany({ select: { category: true }, distinct: ['category'] });
  return rows.map((r) => r.category).filter(Boolean).sort();
}

export async function getProfile() {
  const [user, total, published, featured, latest] = await Promise.all([
    prisma.user.findUnique({
      where: { email: AUTHORIZED_EMAIL },
      select: { name: true, email: true, image: true, role: true, createdAt: true, companyName: true },
    }),
    prisma.deploymentProduct.count(),
    prisma.deploymentProduct.count({ where: { isPublished: true } }),
    prisma.deploymentProduct.count({ where: { isFeatured: true } }),
    prisma.deploymentProduct.findFirst({ orderBy: { updatedAt: 'desc' }, select: { id: true, title: true, updatedAt: true } }),
  ]);
  return { user, stats: { total, published, featured, drafts: total - published }, latest };
}
