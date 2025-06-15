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

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## useEffect Hook

Side effect'ler için `useEffect` hook'unu kullanırız:

```javascript
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []); // Empty dependency array - runs once

  if (loading) return <div>Loading...</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

## Best Practices

1. **Dependency Array**: `useEffect`'te dependency array'i doğru kullanın
2. **Custom Hooks**: Tekrar kullanılabilir logic için custom hook'lar yazın
3. **Performance**: `useMemo` ve `useCallback` ile performansı optimize edin

## Sonuç

React Hooks, modern React geliştirmenin temel taşlarından biridir. Doğru kullanıldığında, daha temiz ve maintainable kod yazmanızı sağlar. 