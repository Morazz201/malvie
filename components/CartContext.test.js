require('../test-setup.js');
const test = require('node:test');
const assert = require('node:assert');
const React = require('react');
const { render, fireEvent, screen, act, cleanup } = require('@testing-library/react');
const { CartProvider, useCart } = require('./CartContext.js');

function TestConsumer() {
  const { cart, cartCount, addToCart, removeItem, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-length">{cart.length}</div>
      <button data-testid="add-btn" onClick={() => addToCart({ id: 'p1', name: 'Product 1' }, 'M', 2)}>Add</button>
      <button data-testid="add-different-btn" onClick={() => addToCart({ id: 'p2', name: 'Product 2' }, 'L', 1)}>Add Different</button>
      <button data-testid="remove-btn" onClick={() => removeItem('p1', 'M')}>Remove</button>
      <button data-testid="update-btn" onClick={() => updateQuantity('p1', 'M', -1)}>Update</button>
      <button data-testid="clear-btn" onClick={() => clearCart()}>Clear</button>
    </div>
  );
}

let renderResult;
const renderWithProvider = async (ui) => {
  if (renderResult) {
    renderResult.unmount();
  }
  cleanup();
  window.localStorage.clear();
  await act(async () => {
    renderResult = render(<CartProvider>{ui}</CartProvider>);
  });
  return renderResult;
};

test('CartContext initial state', async () => {
  await renderWithProvider(<TestConsumer />);
  assert.strictEqual(screen.getByTestId('cart-count').textContent, '0');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '0');
});

test('CartContext loads initial state from localStorage', async () => {
  if (renderResult) renderResult.unmount();
  cleanup();
  window.localStorage.clear();
  window.localStorage.setItem('cart', JSON.stringify([
    { id: '1', size: 'M', quantity: 2 },
    { id: '2', size: 'S', quantity: 1 }
  ]));

  await act(async () => {
    renderResult = render(<CartProvider><TestConsumer /></CartProvider>);
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '3');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '2');
});

test('addToCart adds new item', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '2');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '1');
});

test('addToCart updates existing item quantity', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '4');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '1');
});

test('addToCart adds different item as new entry', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-different-btn'));
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '3');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '2');
});

test('removeItem works', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-different-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('remove-btn'));
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '1');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '1');
});

test('updateQuantity modifies quantity', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn')); // quantity = 2
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('update-btn')); // decreases by 1
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '1');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '1');
});

test('updateQuantity removes item if quantity becomes <= 0', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn')); // quantity = 2
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('update-btn')); // quantity = 1
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('update-btn')); // quantity = 0 -> removed
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '0');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '0');
});

test('clearCart empties cart', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-different-btn'));
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('clear-btn'));
  });

  assert.strictEqual(screen.getByTestId('cart-count').textContent, '0');
  assert.strictEqual(screen.getByTestId('cart-length').textContent, '0');
});

test('localStorage updates on cart changes', async () => {
  await renderWithProvider(<TestConsumer />);

  await act(async () => {
    fireEvent.click(screen.getByTestId('add-btn'));
  });

  const storedCart = JSON.parse(window.localStorage.getItem('cart'));
  assert.strictEqual(storedCart.length, 1);
  assert.strictEqual(storedCart[0].id, 'p1');
  assert.strictEqual(storedCart[0].quantity, 2);
});
