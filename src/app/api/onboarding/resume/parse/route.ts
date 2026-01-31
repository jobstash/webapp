import {
  checkFilename,
  checkMagicBytes,
  checkOrigin,
  checkRateLimit,
  computeFileHash,
  getCachedResult,
  getClientIp,
  runGuards,
  setCachedResult,
} from '@/lib/server/guards';
import { uploadResume } from '@/lib/server/r2';
import {
  extractText,
  matchSkills,
  parseResume,
  transformAddress,
} from '@/lib/server/resume-parser';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_PAGE_COUNT = 2;

const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request);

  const preCheck = await runGuards(
    () => checkOrigin(request),
    () => checkRateLimit(ip),
  );
  if (preCheck) return preCheck;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return Response.json({ error: 'Missing or invalid file' }, { status: 400 });
  }

  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return Response.json(
      { error: 'Unsupported file type. Accepted: PDF, DOC, DOCX' },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return Response.json({ error: 'File is empty' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 1MB' },
      { status: 400 },
    );
  }

  const filenameCheck = checkFilename(file.name);
  if (filenameCheck) return filenameCheck;

  const buffer = await file.arrayBuffer();

  const magicCheck = checkMagicBytes(buffer);
  if (magicCheck) return magicCheck;

  const hash = computeFileHash(buffer);
  const cached = getCachedResult(hash);
  if (cached) return cached;

  let text: string;
  let pageCount: number;
  try {
    ({ text, pageCount } = await extractText(buffer.slice(0), file.type));
  } catch (error) {
    console.error('[resume-parse] extractText failed:', error);
    return Response.json(
      { error: 'Could not extract text from file' },
      { status: 400 },
    );
  }

  if (pageCount > MAX_PAGE_COUNT) {
    return Response.json({ error: 'Resume is too long' }, { status: 400 });
  }

  const extraction = await parseResume(text);

  if (!extraction.isResume) {
    return Response.json(
      { error: 'Document does not appear to be a resume' },
      { status: 400 },
    );
  }

  const resumeId = await uploadResume(buffer, file.name, file.type);

  const skills = await matchSkills(extraction.skills);
  const address = transformAddress(extraction.location);

  const result = Response.json({
    resumeId,
    fileName: file.name,
    name: extraction.name,
    email: extraction.email,
    phone: extraction.phone,
    address,
    skills,
    socials: extraction.socials,
  });
  setCachedResult(hash, result);

  return result;
};
