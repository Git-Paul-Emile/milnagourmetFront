export class UnauthenticatedError extends Error {
  constructor() {
    super('User not authenticated');
    this.name = 'UnauthenticatedError';
  }
}