---
title: "TypeScript Best Practices"
description: "TypeScript projeleri için en iyi uygulamalar ve kodlama standartları."
tags: ["typescript", "javascript", "best-practices", "web-development"]
date: "2025-01-10"
---

# TypeScript Best Practices

TypeScript projelerinde clean code ve maintainable yapılar oluşturmak için önemli best practice'ler.

## Güçlü Type Definitions

Zayıf type tanımlamaları yerine spesifik ve güçlü tipler kullanın:

```ts
// ❌ Zayıf type tanımı
interface User {
  id: any;
  name: string;
  email?: string;
  role: string;
  data: object;
}

// ✅ Güçlü type tanımı
interface User {
  readonly id: UserID;
  name: NonEmptyString;
  email: EmailAddress | null;
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
  lastLoginAt: Date | null;
}

// Brand types for better type safety
type UserID = string & { readonly brand: unique symbol };
type EmailAddress = string & { readonly brand: unique symbol };
type NonEmptyString = string & { readonly brand: unique symbol };

type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

interface UserProfile {
  avatar: URL | null;
  bio: string;
  preferences: UserPreferences;
  socialLinks: SocialLinks;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: SupportedLanguage;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

type SupportedLanguage = 'en' | 'tr' | 'fr' | 'de' | 'es';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showLastLogin: boolean;
}

interface SocialLinks {
  twitter?: URL;
  linkedin?: URL;
  github?: URL;
  website?: URL;
}

// Helper functions for brand types
function createUserID(id: string): UserID {
  if (!id || id.trim().length === 0) {
    throw new Error('UserID cannot be empty');
  }
  return id as UserID;
}

function createEmailAddress(email: string): EmailAddress {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address');
  }
  return email as EmailAddress;
}

function createNonEmptyString(str: string): NonEmptyString {
  if (!str || str.trim().length === 0) {
    throw new Error('String cannot be empty');
  }
  return str.trim() as NonEmptyString;
}
```

## Advanced Generic Types

Generic'leri etkili bir şekilde kullanın:

```ts
// Advanced API response type with error handling
interface ApiResponse<TData, TError = ApiError> {
  success: boolean;
  data: TData | null;
  error: TError | null;
  meta: ResponseMeta;
}

interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Generic Repository Pattern
interface Repository<TEntity, TID = string> {
  findById(id: TID): Promise<TEntity | null>;
  findMany(filter: Partial<TEntity>): Promise<TEntity[]>;
  create(entity: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TEntity>;
  update(id: TID, updates: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: TID): Promise<boolean>;
}

// Generic Event System
interface EventMap {
  'user:created': { user: User };
  'user:updated': { user: User; changes: Partial<User> };
  'user:deleted': { userId: UserID };
  'post:published': { post: Post; author: User };
  'comment:added': { comment: Comment; post: Post };
}

type EventHandler<T extends keyof EventMap> = (data: EventMap[T]) => void | Promise<void>;

class EventEmitter {
  private handlers: {
    [K in keyof EventMap]?: Set<EventHandler<K>>;
  } = {};

  on<T extends keyof EventMap>(event: T, handler: EventHandler<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    this.handlers[event]!.add(handler);
  }

  off<T extends keyof EventMap>(event: T, handler: EventHandler<T>): void {
    this.handlers[event]?.delete(handler);
  }

  async emit<T extends keyof EventMap>(event: T, data: EventMap[T]): Promise<void> {
    const eventHandlers = this.handlers[event];
    if (!eventHandlers) return;

    const promises = Array.from(eventHandlers).map(handler => 
      Promise.resolve(handler(data))
    );

    await Promise.allSettled(promises);
  }
}

// Usage example
const eventEmitter = new EventEmitter();

eventEmitter.on('user:created', async ({ user }) => {
  console.log(`Welcome ${user.name}!`);
  // Send welcome email
});

eventEmitter.on('post:published', async ({ post, author }) => {
  console.log(`${author.name} published: ${post.title}`);
  // Notify subscribers
});
```

## Utility Types Mastery

Built-in utility type'ları etkili kullanın:

```ts
// Domain entities
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  metadata: PostMetadata;
}

interface PostMetadata {
  readingTime: number;
  wordCount: number;
  featuredImage?: string;
  excerpt: string;
}

// API DTOs using utility types
type CreatePostRequest = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  publish?: boolean;
};

type UpdatePostRequest = Partial<Pick<Post, 'title' | 'content' | 'tags' | 'metadata'>>;

type PostSummary = Pick<Post, 'id' | 'title' | 'slug' | 'status' | 'authorId' | 'publishedAt'> & {
  author: Pick<User, 'id' | 'name'>;
  tagCount: number;
};

type PublishedPost = Post & {
  status: 'published';
  publishedAt: Date; // Override to make it required
};

// Advanced mapped types
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Database entity (some fields optional for creation)
type CreateUserEntity = OptionalFields<User, 'id' | 'createdAt' | 'lastLoginAt'>;

// API response (some fields required)
type UserResponse = RequiredFields<User, 'email' | 'profile'>;

// Conditional types for API responses
type ApiData<T> = T extends 'user' 
  ? User 
  : T extends 'post' 
  ? Post 
  : T extends 'comment' 
  ? Comment 
  : never;

// Generic API client
class ApiClient {
  async get<T extends 'user' | 'post' | 'comment'>(
    endpoint: T, 
    id: string
  ): Promise<ApiResponse<ApiData<T>>> {
    const response = await fetch(`/api/${endpoint}/${id}`);
    return response.json();
  }

  async list<T extends 'user' | 'post' | 'comment'>(
    endpoint: T,
    params?: Record<string, string>
  ): Promise<ApiResponse<ApiData<T>[]>> {
    const url = new URL(`/api/${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString());
    return response.json();
  }
}

// Usage
const api = new ApiClient();

// TypeScript knows the return type is ApiResponse<User>
const userResponse = await api.get('user', '123');

// TypeScript knows the return type is ApiResponse<Post[]>
const postsResponse = await api.list('post', { status: 'published' });
```

## Type-Safe Error Handling

Robust error handling with types:

```ts
// Result pattern for error handling
type Result<T, E = Error> = Success<T> | Failure<E>;

interface Success<T> {
  success: true;
  data: T;
}

interface Failure<E> {
  success: false;
  error: E;
}

// Specific error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

class AuthorizationError extends Error {
  constructor(
    public action: string,
    public resource: string
  ) {
    super(`Not authorized to ${action} ${resource}`);
    this.name = 'AuthorizationError';
  }
}

type AppError = ValidationError | NotFoundError | AuthorizationError;

// Service layer with proper error handling
class UserService {
  constructor(private repository: Repository<User, UserID>) {}

  async createUser(userData: CreateUserRequest): Promise<Result<User, AppError>> {
    try {
      // Validation
      const validationResult = this.validateUserData(userData);
      if (!validationResult.success) {
        return validationResult;
      }

      // Check if user already exists
      const existingUser = await this.repository.findMany({ 
        email: userData.email 
      });
      
      if (existingUser.length > 0) {
        return {
          success: false,
          error: new ValidationError(
            'User with this email already exists',
            'email',
            'DUPLICATE_EMAIL'
          )
        };
      }

      // Create user
      const user = await this.repository.create({
        ...userData,
        id: createUserID(crypto.randomUUID()),
        createdAt: new Date(),
      });

      return {
        success: true,
        data: user
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof AppError ? error : new Error('Unknown error occurred')
      };
    }
  }

  async getUserById(id: UserID): Promise<Result<User, NotFoundError>> {
    try {
      const user = await this.repository.findById(id);
      
      if (!user) {
        return {
          success: false,
          error: new NotFoundError('User', id)
        };
      }

      return {
        success: true,
        data: user
      };

    } catch (error) {
      return {
        success: false,
        error: new NotFoundError('User', id)
      };
    }
  }

  private validateUserData(userData: CreateUserRequest): Result<void, ValidationError> {
    if (!userData.name || userData.name.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('Name is required', 'name', 'REQUIRED')
      };
    }

    if (!userData.email || userData.email.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('Email is required', 'email', 'REQUIRED')
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return {
        success: false,
        error: new ValidationError('Invalid email format', 'email', 'INVALID_FORMAT')
      };
    }

    return { success: true, data: undefined };
  }
}

// Usage in API handlers
async function createUserHandler(request: Request): Promise<Response> {
  const userService = new UserService(userRepository);
  const userData = await request.json();

  const result = await userService.createUser(userData);

  if (!result.success) {
    const { error } = result;
    
    if (error instanceof ValidationError) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: {
          field: error.field,
          code: error.code,
          message: error.message
        }
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(result.data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Configuration & Environment Types

Type-safe configuration management:

```ts
// Environment configuration
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
  EMAIL_FROM: string;
  SENTRY_DSN?: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

// Configuration validation
function validateConfig(): EnvironmentConfig {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'AWS_REGION',
    'AWS_S3_BUCKET',
    'EMAIL_FROM',
    'LOG_LEVEL'
  ] as const;

  const config: Partial<EnvironmentConfig> = {};

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      throw new Error(`Required environment variable ${varName} is not set`);
    }

    // Type-specific parsing
    if (varName === 'PORT') {
      const port = parseInt(value, 10);
      if (isNaN(port) || port <= 0) {
        throw new Error(`PORT must be a positive number, got: ${value}`);
      }
      config.PORT = port;
    } else {
      (config as any)[varName] = value;
    }
  }

  // Optional variables
  if (process.env.SENTRY_DSN) {
    config.SENTRY_DSN = process.env.SENTRY_DSN;
  }

  return config as EnvironmentConfig;
}

// Application configuration
interface AppConfig {
  env: EnvironmentConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  storage: StorageConfig;
  email: EmailConfig;
}

interface DatabaseConfig {
  url: string;
  maxConnections: number;
  timeoutMs: number;
}

interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
}

interface StorageConfig {
  region: string;
  bucket: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

interface EmailConfig {
  from: string;
  templates: EmailTemplates;
}

interface EmailTemplates {
  welcome: string;
  passwordReset: string;
  emailVerification: string;
}

// Configuration factory
class ConfigFactory {
  static create(): AppConfig {
    const env = validateConfig();

    return {
      env,
      database: {
        url: env.DATABASE_URL,
        maxConnections: 20,
        timeoutMs: 30000,
      },
      auth: {
        jwtSecret: env.JWT_SECRET,
        jwtExpiresIn: '7d',
        bcryptRounds: 12,
      },
      storage: {
        region: env.AWS_REGION,
        bucket: env.AWS_S3_BUCKET,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'application/pdf',
        ],
      },
      email: {
        from: env.EMAIL_FROM,
        templates: {
          welcome: 'welcome-template',
          passwordReset: 'password-reset-template',
          emailVerification: 'email-verification-template',
        },
      },
    };
  }
}

// Usage
const config = ConfigFactory.create();

// TypeScript knows the exact structure and types
console.log(`Server running on port ${config.env.PORT}`);
console.log(`Database: ${config.database.url}`);
console.log(`Storage bucket: ${config.storage.bucket}`);
```

## Best Practices Summary

1. **Strict Type Definitions**: Zayıf `any` ve `object` types yerine spesifik interface'ler kullanın
2. **Brand Types**: String ve number primitive'leri için semantic types oluşturun
3. **Generic Constraints**: Generic'lerde `extends` kullanarak type safety sağlayın
4. **Utility Types**: Built-in utility types'ları etkili kullanın
5. **Error Handling**: Result pattern ile type-safe error handling
6. **Configuration**: Environment variables için type-safe validation
7. **API Design**: Consistent API response types ve error handling

## Sonuç

TypeScript'in gücünden tam anlamıyla yararlanmak için bu best practice'leri uygulayın. Güçlü type system sayesinde runtime error'ları azaltacak, kod kalitesini artıracak ve geliştirici deneyimini iyileştireceksiniz. 