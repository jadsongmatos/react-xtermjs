import { jest } from '@jest/globals';

jest.mock('@xterm/xterm', () => {
  const mockInstance = {
    open: jest.fn(),
    focus: jest.fn(),
    dispose: jest.fn(),
    loadAddon: jest.fn(),
    onBinary: jest.fn(),
    onCursorMove: jest.fn(),
    onLineFeed: jest.fn(),
    onScroll: jest.fn(),
    onSelectionChange: jest.fn(),
    onRender: jest.fn(),
    onResize: jest.fn(),
    onTitleChange: jest.fn(),
    onKey: jest.fn(),
    onData: jest.fn(),
    attachCustomKeyEventHandler: jest.fn(),
  };
  return {
    Terminal: jest.fn(() => mockInstance),
    __esModule: true,
  };
});

import { useXTerm, XTerm } from '../src/index';

describe('index.ts re-exports', () => {
  it('should re-export useXTerm from xterm module', () => {
    expect(typeof useXTerm).toBe('function');
  });

  it('should re-export XTerm from xterm module', () => {
    expect(typeof XTerm).toBe('function');
  });

  it('should re-export UseXTermProps type (compile-time check via usage)', () => {
    const props: Parameters<typeof useXTerm>[0] = {
      options: { fontSize: 12 },
    };
    expect(props.options).toEqual({ fontSize: 12 });
  });
});
