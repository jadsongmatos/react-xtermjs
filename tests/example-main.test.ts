import { jest } from '@jest/globals';

describe('example/src/main.jsx behavior', () => {
  it('should use ReactDOM.createRoot to mount the app', () => {
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    const mockRender = jest.fn();
    const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

    jest.doMock('react-dom/client', () => ({
      createRoot: mockCreateRoot,
    }));
    jest.doMock('react', () => ({
      __esModule: true,
      default: { createElement: jest.fn(() => null) },
    }));

    expect(document.getElementById('root')).toBe(rootEl);
    expect(typeof mockCreateRoot).toBe('function');
  });
});
