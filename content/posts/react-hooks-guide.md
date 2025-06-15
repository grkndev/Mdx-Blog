---
title: "React Hooks Rehberi: Modern React Uygulamaları"
description: "React Hooks ile modern ve performanslı React uygulamaları nasıl geliştirilir? useState, useEffect ve diğer hook'ların kullanımı."
tags: ["react", "javascript", "hooks", "frontend"]
date: "2025-01-15"
---

# React Hooks Rehberi: Modern React Uygulamaları

React Hooks, functional componentlerde state ve lifecycle yönetimi için kullanılan güçlü araçlardır. Bu rehberde, en sık kullanılan hook'ları ve best practice'leri inceleyeceğiz.

## useState Hook

`useState` hook'u ile functional componentlerde state yönetimi yapabiliriz:

```tsx
import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState<number>(initialValue);
  const [history, setHistory] = useState<number[]>([initialValue]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory(prev => [...prev, newCount]);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory(prev => [...prev, newCount]);
  };

  const reset = () => {
    setCount(initialValue);
    setHistory([initialValue]);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Counter: {count}</h3>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +{step}
        </button>
        <button 
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -{step}
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      <div className="text-sm text-gray-600">
        <p>History: {history.join(' → ')}</p>
      </div>
    </div>
  );
}

export default Counter;
```

## useEffect Hook

Side effect'ler için `useEffect` hook'unu kullanırız:

```tsx
import React, { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface UserProfileProps {
  userId: number;
}

function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  // Cleanup effect for WebSocket connections
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/users/${userId}`);
    
    ws.onmessage = (event) => {
      const updatedUser = JSON.parse(event.data);
      setUser(updatedUser);
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mb-4" />
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}
```

## Custom Hook Örneği

Reusable logic için custom hook oluşturalım:

```tsx
import { useState, useEffect, useCallback } from 'react';

// Local Storage Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Usage Example
function TodoApp() {
  const [todos, setTodos] = useLocalStorage('todos', []);

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Performance Optimization

`useMemo` ve `useCallback` ile performansı optimize edin:

```tsx
import React, { useState, useMemo, useCallback } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
}

function ShoppingList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // Expensive computation - memoized
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return a.price - b.price;
      });
  }, [items, filter, sortBy]);

  // Memoized callback
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  return (
    <div className="p-4">
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter items..."
        className="px-3 py-2 border rounded mb-4"
      />
      
      <div className="grid gap-4">
        {filteredAndSortedItems.map(item => (
          <div key={item.id} className="p-3 border rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.category}</p>
            <p className="font-bold">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Dependency Array**: `useEffect`'te dependency array'i doğru kullanın
2. **Custom Hooks**: Tekrar kullanılabilir logic için custom hook'lar yazın
3. **Performance**: `useMemo` ve `useCallback` ile gereksiz re-render'ları önleyin
4. **Clean Up**: Memory leak'leri önlemek için cleanup function'ları kullanın

## Sonuç

React Hooks, modern React geliştirmenin temel taşlarından biridir. Doğru kullanıldığında, daha temiz ve maintainable kod yazmanızı sağlar. 