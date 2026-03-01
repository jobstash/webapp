import 'server-only';

interface StackFrame {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
  in_app: boolean;
}

const FRAME_RE = /^\s*at\s+(?:(.+?)\s+\((.+?):(\d+):(\d+)\)|(.+?):(\d+):(\d+))/;

export const parseStack = (stack: string): StackFrame[] => {
  const frames: StackFrame[] = [];

  for (const line of stack.split('\n')) {
    const match = FRAME_RE.exec(line);
    if (!match) continue;

    const isNamed = Boolean(match[1]);
    const filename = (isNamed ? match[2] : match[5]) ?? '';
    const lineno = Number(isNamed ? match[3] : match[6]);
    const colno = Number(isNamed ? match[4] : match[7]);

    frames.push({
      filename,
      function: isNamed ? match[1]! : '?',
      lineno,
      colno,
      in_app: !filename.includes('node_modules'),
    });
  }

  return frames.reverse();
};
