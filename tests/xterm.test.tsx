import { jest } from '@jest/globals';

const mockOnBinary = jest.fn();
const mockOnCursorMove = jest.fn();
const mockOnLineFeed = jest.fn();
const mockOnScroll = jest.fn();
const mockOnSelectionChange = jest.fn();
const mockOnRender = jest.fn();
const mockOnResize = jest.fn();
const mockOnTitleChange = jest.fn();
const mockOnKey = jest.fn();
const mockOnData = jest.fn();
const mockAttachCustomKeyEventHandler = jest.fn();
const mockOpen = jest.fn();
const mockFocus = jest.fn();
const mockDispose = jest.fn();
const mockLoadAddon = jest.fn();

let mockTerminalInstance: Record<string, jest.Mock>;

beforeEach(() => {
  mockTerminalInstance = {
    open: mockOpen,
    focus: mockFocus,
    dispose: mockDispose,
    loadAddon: mockLoadAddon,
    onBinary: mockOnBinary,
    onCursorMove: mockOnCursorMove,
    onLineFeed: mockOnLineFeed,
    onScroll: mockOnScroll,
    onSelectionChange: mockOnSelectionChange,
    onRender: mockOnRender,
    onResize: mockOnResize,
    onTitleChange: mockOnTitleChange,
    onKey: mockOnKey,
    onData: mockOnData,
    attachCustomKeyEventHandler: mockAttachCustomKeyEventHandler,
  };

  jest.clearAllMocks();
});

const MockedTerminal = jest.fn(() => mockTerminalInstance);

jest.mock('@xterm/xterm', () => ({
  Terminal: MockedTerminal,
  __esModule: true,
}));

import { render } from '@testing-library/react';
import { useXTerm, XTerm } from '../src/xterm';

function renderHook<TResult>(hookFn: () => TResult): { result: { current: TResult } } {
  let result: TResult = undefined as unknown as TResult;
  function TestComponent() {
    result = hookFn();
    return null;
  }
  render(<TestComponent />);
  return { result: { current: result } };
}

describe('useXTerm', () => {
  it('should create a Terminal instance with default options', () => {
    renderHook(() => useXTerm());
    expect(MockedTerminal).toHaveBeenCalledWith(
      expect.objectContaining({
        fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        fontSize: 14,
        cursorStyle: 'underline',
        cursorBlink: false,
      })
    );
  });

  it('should merge custom options with defaults', () => {
    renderHook(() =>
      useXTerm({
        options: { fontSize: 20, cursorBlink: true },
      })
    );
    expect(MockedTerminal).toHaveBeenCalledWith(
      expect.objectContaining({
        fontSize: 20,
        cursorBlink: true,
        fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
      })
    );
  });

  it('should return instance after mount', () => {
    let instance: unknown = 'not-null';
    function TestComponent() {
      const result = useXTerm();
      instance = result.instance;
      return <div ref={result.ref} />;
    }
    render(<TestComponent />);
    expect(instance).toBeDefined();
  });

  it('should call instance.open when ref is attached to a DOM element', () => {
    function TestComponent() {
      const { ref } = useXTerm();
      return <div ref={ref} />;
    }
    render(<TestComponent />);
    expect(mockOpen).toHaveBeenCalled();
    expect(mockFocus).toHaveBeenCalled();
  });

  it('should not call instance.open when ref is not attached', () => {
    renderHook(() => useXTerm());
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockFocus).not.toHaveBeenCalled();
  });

  it('should load addons when provided', () => {
    const mockAddon = { activate: jest.fn(), dispose: jest.fn() } as unknown as import('@xterm/xterm').ITerminalAddon;
    renderHook(() => useXTerm({ addons: [mockAddon] }));
    expect(mockLoadAddon).toHaveBeenCalledWith(mockAddon);
  });

  it('should register event listeners when provided', () => {
    const onBinary = jest.fn();
    const onCursorMove = jest.fn();
    const onData = jest.fn();
    const onKey = jest.fn();
    const onLineFeed = jest.fn();
    const onScroll = jest.fn();
    const onSelectionChange = jest.fn();
    const onRender = jest.fn();
    const onResize = jest.fn();
    const onTitleChange = jest.fn();
    const customKeyEventHandler = (() => true) as (e: KeyboardEvent) => boolean;

    renderHook(() =>
      useXTerm({
        listeners: {
          onBinary,
          onCursorMove,
          onData,
          onKey,
          onLineFeed,
          onScroll,
          onSelectionChange,
          onRender,
          onResize,
          onTitleChange,
          customKeyEventHandler,
        },
      })
    );

    expect(mockOnBinary).toHaveBeenCalledWith(onBinary);
    expect(mockOnCursorMove).toHaveBeenCalledWith(onCursorMove);
    expect(mockOnData).toHaveBeenCalledWith(onData);
    expect(mockOnKey).toHaveBeenCalledWith(onKey);
    expect(mockOnLineFeed).toHaveBeenCalledWith(onLineFeed);
    expect(mockOnScroll).toHaveBeenCalledWith(onScroll);
    expect(mockOnSelectionChange).toHaveBeenCalledWith(onSelectionChange);
    expect(mockOnRender).toHaveBeenCalledWith(onRender);
    expect(mockOnResize).toHaveBeenCalledWith(onResize);
    expect(mockOnTitleChange).toHaveBeenCalledWith(onTitleChange);
    expect(mockAttachCustomKeyEventHandler).toHaveBeenCalledWith(customKeyEventHandler);
  });

  it('should not register listeners when none are provided', () => {
    renderHook(() => useXTerm());
    expect(mockOnBinary).not.toHaveBeenCalled();
    expect(mockOnCursorMove).not.toHaveBeenCalled();
    expect(mockOnData).not.toHaveBeenCalled();
    expect(mockOnKey).not.toHaveBeenCalled();
    expect(mockOnScroll).not.toHaveBeenCalled();
    expect(mockAttachCustomKeyEventHandler).not.toHaveBeenCalled();
  });

  it('should call instance.dispose on unmount', () => {
    function TestComponent() {
      const { ref } = useXTerm();
      return <div ref={ref} />;
    }
    const { unmount } = render(<TestComponent />);
    expect(mockDispose).not.toHaveBeenCalled();
    unmount();
    expect(mockDispose).toHaveBeenCalledTimes(1);
  });
});

describe('XTerm', () => {
  it('should render a div element', () => {
    const { container } = render(<XTerm />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should pass className to the div', () => {
    const { container } = render(<XTerm className="my-terminal" />);
    expect(container.querySelector('div.my-terminal')).toBeInTheDocument();
  });

  it('should pass extra props to the div', () => {
    const { container } = render(<XTerm data-testid="xterm-container" />);
    expect(container.querySelector('[data-testid="xterm-container"]')).toBeInTheDocument();
  });

  it('should create a Terminal instance when rendered', () => {
    render(<XTerm />);
    expect(MockedTerminal).toHaveBeenCalled();
  });

  it('should call instance.open when rendered into DOM', () => {
    render(<XTerm />);
    expect(mockOpen).toHaveBeenCalled();
  });
});
