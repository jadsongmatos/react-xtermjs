import { jest } from '@jest/globals';

const mockWriteln = jest.fn();
const mockWrite = jest.fn();
const mockReset = jest.fn();
const mockOnData = jest.fn();
const mockOpen = jest.fn();
const mockFocus = jest.fn();
const mockDispose = jest.fn();
const mockLoadAddon = jest.fn();

const mockInstance = {
  open: mockOpen,
  focus: mockFocus,
  dispose: mockDispose,
  loadAddon: mockLoadAddon,
  writeln: mockWriteln,
  write: mockWrite,
  reset: mockReset,
  onData: mockOnData,
  onBinary: jest.fn(),
  onCursorMove: jest.fn(),
  onLineFeed: jest.fn(),
  onScroll: jest.fn(),
  onSelectionChange: jest.fn(),
  onRender: jest.fn(),
  onResize: jest.fn(),
  onTitleChange: jest.fn(),
  onKey: jest.fn(),
  attachCustomKeyEventHandler: jest.fn(),
};

const MockedTerminal = jest.fn(() => mockInstance);

jest.mock('@xterm/xterm', () => ({
  Terminal: MockedTerminal,
  __esModule: true,
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useXTerm } from '../src/xterm';

function ExampleApp() {
  const { instance, ref } = useXTerm();
  instance?.writeln('Hello from react-xtermjs!');
  instance?.onData((data: string) => instance?.write(data));

  return (
    <div>
      <button type="button" onClick={() => instance?.reset()}>
        Clear terminal
      </button>
      <div ref={ref} />
    </div>
  );
}

describe('example/src/App.jsx behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a Clear terminal button', () => {
    render(<ExampleApp />);
    expect(screen.getByRole('button', { name: /clear terminal/i })).toBeInTheDocument();
  });

  it('should call writeln with greeting on mount', () => {
    render(<ExampleApp />);
    expect(mockWriteln).toHaveBeenCalledWith('Hello from react-xtermjs!');
  });

  it('should register onData listener echoing input', () => {
    render(<ExampleApp />);
    expect(mockOnData).toHaveBeenCalled();
  });

  it('should call instance.reset when Clear terminal button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExampleApp />);
    const button = screen.getByRole('button', { name: /clear terminal/i });
    await user.click(button);
    expect(mockReset).toHaveBeenCalled();
  });
});
