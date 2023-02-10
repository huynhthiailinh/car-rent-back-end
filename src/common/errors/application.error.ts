export interface ChildError {
  key: string;
  field: string;
}

export class ApplicationError extends Error {
  public mainErrorKey: string;
  public childErrors?: ChildError[];

  constructor(errorKey: string, childErrors?: ChildError[]) {
    super(errorKey);
    this.mainErrorKey = errorKey;
    this.childErrors = childErrors;
  }
}
