import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import Toast from './Toast.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.React = React;

describe('Toast Component', () => {
  beforeEach(() => {
    mock.timers.enable();
  });

  afterEach(() => {
    mock.timers.reset();
    cleanup();
  });

  it('does not render when visible is false', () => {
    const { container } = render(<Toast message="Hello" visible={false} onClose={() => {}} />);
    assert.strictEqual(container.firstChild, null);
  });

  it('renders the message when visible is true', () => {
    const { container } = render(<Toast message="Test Message" visible={true} onClose={() => {}} />);
    assert.match(container.textContent, /Test Message/);
  });

  it('calls onClose after 3000ms when visible is true', () => {
    const onCloseMock = mock.fn();
    render(<Toast message="Timeout Message" visible={true} onClose={onCloseMock} />);

    assert.strictEqual(onCloseMock.mock.callCount(), 0);

    act(() => {
      mock.timers.tick(3000);
    });

    assert.strictEqual(onCloseMock.mock.callCount(), 1);
  });

  it('clears timeout if component unmounts before 3000ms', () => {
    const onCloseMock = mock.fn();
    const { unmount } = render(<Toast message="Timeout Message" visible={true} onClose={onCloseMock} />);

    act(() => {
      mock.timers.tick(1000);
    });

    unmount();

    act(() => {
      mock.timers.tick(2000);
    });

    assert.strictEqual(onCloseMock.mock.callCount(), 0);
  });
});
