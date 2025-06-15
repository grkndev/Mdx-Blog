---
title: "TypeScript Best Practices"
description: "TypeScript projeleri için en iyi uygulamalar ve kodlama standartları."
tags: ["typescript", "javascript", "best-practices", "web-development"]
date: "2025-01-10"
---

# TypeScript Best Practices

TypeScript projelerinde clean code ve maintainable yapılar oluşturmak için önemli best practice'ler.

## Type Definitions

Güçlü type tanımlamaları yapın:

```typescript
// ❌ Zayıf type tanımı
interface User {
  id: any;
  name: string;
  email?: string;
}

// ✅ Güçlü type tanımı
interface User {
  id: number;
  name: string;
  email: string | null;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: 'tr' | 'en';
}
```

## Generic Types

Generic'leri etkili kullanın:

```typescript
// Reusable API response type
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Usage
const userResponse: ApiResponse<User[]> = await fetchUsers();
const postResponse: ApiResponse<Post> = await fetchPost(id);
```

## Utility Types

Built-in utility type'ları kullanın:

```typescript
// Partial for updates
function updateUser(id: number, updates: Partial<User>) {
  // Implementation
}

// Pick for selecting specific fields
type UserSummary = Pick<User, 'id' | 'name' | 'email'>;

// Omit for excluding fields
type CreateUserRequest = Omit<User, 'id' | 'createdAt'>;
```

## Error Handling

Type-safe error handling:

```typescript
type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Sonuç

TypeScript'in gücünden tam anlamıyla yararlanmak için bu best practice'leri uygulayın. 