export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

export class TokenExpiredError extends JWTError {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends JWTError {
  constructor() {
    super('Invalid token provided');
    this.name = 'InvalidTokenError';
  }
}

export class TokenMalformedError extends JWTError {
  constructor() {
    super('Token is malformed');
    this.name = 'TokenMalformedError';
  }
}