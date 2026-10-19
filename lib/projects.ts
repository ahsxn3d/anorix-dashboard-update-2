/** Shared shape of a DeploymentProduct row as the main site reads it (src/lib/data.ts + normalizers). */

export const PRODUCT_STATUS = ['PRODUCTION', 'BETA', 'STAGING', 'UNDER_CONSTRUCTION', 'ARCHIVED'] as const;
export const PRODUCT_TYPE = ['STUDIO_SERVICE', 'SAAS_PLATFORM', 'AI_AGENT_TOOL', 'DEVELOPER_UTILITY'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export type ProductType = (typeof PRODUCT_TYPE)[number];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  PRODUCTION: 'Live',
  BETA: 'Beta',
  STAGING: 'Staging',
  UNDER_CONSTRUCTION: 'In build',
  ARCHIVED: 'Archived',
};
export const TYPE_LABEL: Record<ProductType, string> = {
  STUDIO_SERVICE: 'Studio service',
  SAAS_PLATFORM: 'SaaS platform',
  AI_AGENT_TOOL: 'AI agent tool',
  DEVELOPER_UTILITY: 'Developer utility',
};

export type ProjectInput = {
  title: string;
  slug: string;
  client: string | null;
  year: string | null;
  category: string;
  badge: string | null;
  type: ProductType;
  status: ProductStatus;
  shortDescription: string;
  fullDescription: string | null;
  thumbnailUrl: string;
  coverImageUrl: string | null;
  previewVideoUrl: string | null;
  demoUrl: string;
  liveUrl: string;
  githubUrl: string | null;
  appLaunchUrl: string | null;
  rating: number;
  fpsBenchmark: number;
  auditScore: number;
  tags: string[];
  techStack: string[];
  features: string[];
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
};

/** Plain, serialisable project for client components. */
export type ProjectView = ProjectInput & { id: string; createdAt: string; updatedAt: string };

export const EMPTY_PROJECT: ProjectInput = {
  title: '',
  slug: '',
  client: null,
  year: String(new Date().getFullYear()),
  category: 'Web Applications',
  badge: null,
  type: 'STUDIO_SERVICE',
  status: 'PRODUCTION',
  shortDescription: '',
  fullDescription: null,
  thumbnailUrl: '',
  coverImageUrl: null,
  previewVideoUrl: null,
  demoUrl: '#',
  liveUrl: '#',
  githubUrl: null,
  appLaunchUrl: null,
  rating: 5,
  fpsBenchmark: 60,
  auditScore: 100,
  tags: [],
  techStack: [],
  features: [],
  isFeatured: false,
  isPublished: true,
  displayOrder: 0,
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export type FieldErrors = Partial<Record<keyof ProjectInput, string>>;

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
const opt = (v: FormDataEntryValue | null) => str(v) || null;
const list = (v: FormDataEntryValue | null) => {
  const raw = str(v);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return [...new Set(arr.map((x) => String(x).trim()).filter(Boolean))].slice(0, 40);
  } catch {
    /* fall through to comma list */
  }
  return [...new Set(raw.split(',').map((x) => x.trim()).filter(Boolean))].slice(0, 40);
};
const num = (v: FormDataEntryValue | null, fallback: number) => {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : fallback;
};
const isUrlish = (u: string) => u === '#' || u.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(u);

export function parseProjectForm(fd: FormData): { data: ProjectInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const title = str(fd.get('title'));
  const slug = slugify(str(fd.get('slug')) || title);
  const status = str(fd.get('status')) as ProductStatus;
  const type = str(fd.get('type')) as ProductType;

  const data: ProjectInput = {
    title,
    slug,
    client: opt(fd.get('client')),
    year: opt(fd.get('year')),
    category: str(fd.get('category')) || 'Web Applications',
    badge: opt(fd.get('badge')),
    type: PRODUCT_TYPE.includes(type) ? type : 'STUDIO_SERVICE',
    status: PRODUCT_STATUS.includes(status) ? status : 'PRODUCTION',
    shortDescription: str(fd.get('shortDescription')),
    fullDescription: opt(fd.get('fullDescription')),
    thumbnailUrl: str(fd.get('thumbnailUrl')),
    coverImageUrl: opt(fd.get('coverImageUrl')),
    previewVideoUrl: opt(fd.get('previewVideoUrl')),
    demoUrl: str(fd.get('demoUrl')) || '#',
    liveUrl: str(fd.get('liveUrl')) || '#',
    githubUrl: opt(fd.get('githubUrl')),
    appLaunchUrl: opt(fd.get('appLaunchUrl')),
    rating: Math.round(Math.min(5, Math.max(0, num(fd.get('rating'), 5))) * 10) / 10,
    fpsBenchmark: Math.round(Math.min(240, Math.max(0, num(fd.get('fpsBenchmark'), 60)))),
    auditScore: Math.round(Math.min(100, Math.max(0, num(fd.get('auditScore'), 100)))),
    tags: list(fd.get('tags')),
    techStack: list(fd.get('techStack')),
    features: list(fd.get('features')),
    isFeatured: fd.get('isFeatured') === 'on' || fd.get('isFeatured') === 'true',
    isPublished: fd.get('isPublished') === 'on' || fd.get('isPublished') === 'true',
    displayOrder: Math.round(num(fd.get('displayOrder'), 0)),
  };

  if (!title) errors.title = 'Give the project a name.';
  else if (title.length > 120) errors.title = 'Keep the name under 120 characters.';
  if (!slug) errors.slug = 'The URL slug needs letters or numbers.';
  if (!data.shortDescription) errors.shortDescription = 'One or two lines that sell it.';
  else if (data.shortDescription.length > 400) errors.shortDescription = 'Keep it under 400 characters.';
  if (!data.thumbnailUrl) errors.thumbnailUrl = 'Upload a thumbnail. The catalog card needs it.';
  else if (!isUrlish(data.thumbnailUrl)) errors.thumbnailUrl = 'Use an image link that starts with https://';
  if (data.coverImageUrl && !isUrlish(data.coverImageUrl)) errors.coverImageUrl = 'Use a link that starts with https://';
  for (const k of ['demoUrl', 'liveUrl', 'githubUrl', 'appLaunchUrl', 'previewVideoUrl'] as const) {
    const v = data[k];
    if (v && !isUrlish(v)) errors[k] = 'Use a full link (https://...) or leave it empty.';
  }
  return { data, errors };
}
